import { NextResponse } from 'next/server';

export async function GET() {
  const mockBridgepath = [
      {
            id: 1,
                  company: 'Anduril Industries',
                        valuation: '$8.5B',
                              stage: 'Series C',
                                    ipo_probability: 0.85,
                                          timeline: '2025-2026',
                                                sector: 'Defence Tech',
                                                      signal: 'STRONG',
                                                          },
                                                              {
                                                                    id: 2,
                                                                          company: 'Anthropic',
                                                                                valuation: '$5.0B',
                                                                                      stage: 'Series D',
                                                                                            ipo_probability: 0.75,
                                                                                                  timeline: '2026-2027',
                                                                                                        sector: 'AI',
                                                                                                              signal: 'STRONG',
                                                                                                                  },
                                                                                                                      {
                                                                                                                            id: 3,
                                                                                                                                  company: 'Axiom Space',
                                                                                                                                        valuation: '$2.2B',
                                                                                                                                              stage: 'Series B+',
                                                                                                                                                    ipo_probability: 0.65,
                                                                                                                                                          timeline: '2027-2028',
                                                                                                                                                                sector: 'Space',
                                                                                                                                                                      signal: 'MEDIUM',
                                                                                                                                                                          },
                                                                                                                                                                              {
                                                                                                                                                                                    id: 4,
                                                                                                                                                                                          company: 'Relativity Space',
                                                                                                                                                                                                valuation: '$4.2B',
                                                                                                                                                                                                      stage: 'Series D',
                                                                                                                                                                                                            ipo_probability: 0.72,
                                                                                                                                                                                                                  timeline: '2025-2026',
                                                                                                                                                                                                                        sector: 'Space',
                                                                                                                                                                                                                              signal: 'STRONG',
                                                                                                                                                                                                                                  },
                                                                                                                                                                                                                                      {
                                                                                                                                                                                                                                            id: 5,
                                                                                                                                                                                                                                                  company: 'Shield AI',
                                                                                                                                                                                                                                                        valuation: '$2.7B',
                                                                                                                                                                                                                                                              stage: 'Series C',
                                                                                                                                                                                                                                                                    ipo_probability: 0.68,
                                                                                                                                                                                                                                                                          timeline: '2026-2027',
                                                                                                                                                                                                                                                                                sector: 'Defence AI',
                                                                                                                                                                                                                                                                                      signal: 'MEDIUM',
                                                                                                                                                                                                                                                                                          },
                                                                                                                                                                                                                                                                                            ];
                                                                                                                                                                                                                                                                                            
                                                                                                                                                                                                                                                                                              return NextResponse.json({ companies: mockBridgepath });
                                                                                                                                                                                                                                                                                              }
