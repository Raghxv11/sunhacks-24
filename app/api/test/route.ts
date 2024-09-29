import { NextRequest, NextResponse } from "next/server";
import csv from 'csv-parser';
import { Readable } from 'stream';
import { RandomForestClassifier } from 'ml-random-forest';

export const maxDuration = 300;

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { crimeDataUrl } = await req.json();

    const crimeData = await loadCrimeData(crimeDataUrl);
    const classifiedCrimeData = classifyCrime(crimeData);
    const aggregatedCrimes = aggregateCrimesByZip(classifiedCrimeData);
    const features = createFeatures(classifiedCrimeData);
    const model = trainCrimeClassifier(features);
    const predictedCrimeLevels = predictCrimeLevels(features, model);

    return NextResponse.json({
      status: 200,
      data: {
        aggregatedCrimes,
        predictedCrimeLevels,
      }
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      status: 500,
      data: null,
      error: "An error occurred while processing the crime data."
    });
  }
}

async function loadCrimeData(url: string): Promise<any[]> {
  const response = await fetch(url);
  const data = await response.text();
  return new Promise((resolve, reject) => {
    const results: any[] = [];
    Readable.from(data)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
}

function classifyCrime(crimeData: any[]): any[] {
  return crimeData.map(record => {
    const category = record['UCR CRIME CATEGORY'].toUpperCase();
    if (category.includes('AGGRAVATED ASSAULT') || category.includes('RAPE') || category.includes('MURDER')) {
      record['Crime Classification'] = 'ASSAULT';
    } else if (category.includes('BURGLARY') || category.includes('LARCENY') || category.includes('MOTOR VEHICLE') || category.includes('ROBBERY')) {
      record['Crime Classification'] = 'THEFT';
    } else {
      record['Crime Classification'] = 'OTHER';
    }
    return record;
  });
}

function aggregateCrimesByZip(crimeData: any[]): any[] {
  const zipCodes = [...Array(99)].map((_, i) => 85001 + i).concat([...Array(10)].map((_, i) => 85280 + i));
  const filteredCrimeData = crimeData.filter(record => zipCodes.includes(Number(record['ZIP'])));
  
  const crimeCountByZip = filteredCrimeData.reduce((acc, record) => {
    const zip = record['ZIP'];
    acc[zip] = (acc[zip] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(crimeCountByZip).map(([ZIP, CrimeCount]) => ({ ZIP, CrimeCount }));
}

function createFeatures(crimeData: any[]): any[] {
  const crimeByZip = aggregateCrimesByZip(crimeData);
  const classificationCounts = crimeData.reduce((acc, record) => {
    const zip = record['ZIP'];
    const classification = record['Crime Classification'];
    if (!acc[zip]) acc[zip] = { ASSAULT: 0, THEFT: 0, OTHER: 0 };
    acc[zip][classification]++;
    return acc;
  }, {});

  return crimeByZip.map(record => ({
    ...record,
    ...classificationCounts[record.ZIP]
  }));
}

function trainCrimeClassifier(features: any[]): RandomForestClassifier {
  const X = features.map(f => [f.ASSAULT, f.THEFT, f.OTHER]);
  const y = features.map(f => {
    if (f.CrimeCount > 100) return 3; // VERY HIGH
    if (f.CrimeCount > 50) return 2; // HIGH
    if (f.CrimeCount > 10) return 1; // MEDIUM
    return 0; // LOW
  });

  const classifier = new RandomForestClassifier({
    nEstimators: 100,
    seed: 42
  });

  classifier.train(X, y);
  return classifier;
}

function predictCrimeLevels(features: any[], model: RandomForestClassifier): any[] {
  const X = features.map(f => [f.ASSAULT, f.THEFT, f.OTHER]);
  const predictions = model.predict(X);
  
  const labels = ['LOW', 'MEDIUM', 'HIGH', 'VERY HIGH'];
  return features.map((f, i) => ({
    ZIP: f.ZIP,
    PredictedCrimeLevel: labels[predictions[i]]
  }));
}