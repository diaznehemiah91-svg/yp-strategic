import { NextResponse } from 'next/server';

export async function GET() {
    const mockConflicts = [
{ lat: 33.5138, lng: 36.2765, intensity: 0.9, region: 'Syria', threat: 'Active' },
{ lat: 34.5553, lng: 69.2075, intensity: 0.8, region: 'Afghanistan', threat: 'High' },
{ lat: 19.8563, lng: -155.5644, intensity: 0.6, region: 'Pacific Region', threat: 'Medium' },
{ lat: 37.7749, lng: -122.4194, intensity: 0.3, region: 'Tech Hub Monitoring', threat: 'Low' },
{ lat: 48.8566, lng: 2.3522, intensity: 0.4, region: 'NATO Perimeter', threat: 'Medium' },
{ lat: -33.8688, lng: 151.2093, intensity: 0.2, region: 'AUKUS Alliance', threat: 'Low' },
{ lat: 35.6892, lng: 139.6917, intensity: 0.5, region: 'Indo-Pacific', threat: 'Medium' },
{ lat: 25.2048, lng: 55.2708, intensity: 0.7, region: 'Middle East', threat: 'High' },
  ];

  return NextResponse.json({ conflicts: mockConflicts });
}
