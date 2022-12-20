import { createPathField, createValueField, getValuesByName } from '../json-path-queries';
import { TransformSchema } from '../schema-utils';
export const schema: TransformSchema = {
  templateMeta: [
    {
      name: 'Effort & Site Conditions',
      primaryKey: ['Study Area', 'Date'],
      parentKey: [],
      type: 'root',
      foreignKeys: [
        {
          name: 'Observations',
          primaryKey: ['Study Area', 'Date']
        },
        {
          name: 'Incidental Observations',
          primaryKey: ['Study Area', 'Date']
        }
      ]
    },
    {
      name: 'Observations',
      primaryKey: ['Lat', 'Long'],
      parentKey: ['Study Area', 'Date'],
      type: '',
      foreignKeys: []
    },
    {
      name: 'Marked Animals',
      primaryKey: ['Study Area', 'Transect ID'],
      parentKey: ['Study Area', 'Transect ID'],
      type: '',
      foreignKeys: []
    },
    {
      name: 'Incidental Observations',
      primaryKey: ['Lat', 'Long'],
      parentKey: ['Study Area', 'Date'],
      type: '',
      foreignKeys: []
    }
  ],
  map: [
    {
      name: 'record-level',
      fields: [
        {
          columnName: 'eventID',
          columnValue: [
            {
              paths: [getValuesByName('Effort & Site Conditions', '_key')]
            }
          ]
        },
        {
          columnName: 'occurrenceID',
          columnValue: [
            {
              paths: [getValuesByName('Observations', ['_key'])]
            }
          ]
        },
        createValueField('type', 'Human Observed'),
        createValueField('basisOfRecord', 'Occurrence')
      ]
    },
    {
      // safe to ignore the marked animals for now
      // is the incidental sheet self contained or should it be apart of the OG transform?
      // what life stage are the RISC/ Oswald Bulls?
      // using LAT LONG OR UTM DATA AS UNIQUE IDENTIFIERS
      // will need a way to potentially track unique keys before validation happens
      // what is going to happen with blank rows?
      name: 'event',
      fields: [
        {
          columnName: 'eventID',
          columnValue: [
            {
              paths: [getValuesByName('Observations', ['_key'])]
            }
          ]
        },
        {
          columnName: 'eventDate',
          columnValue: [
            {
              paths: [getValuesByName('Observations', ['Date'])]
            }
          ]
        },
        {
          columnName: 'eventRemarks',
          columnValue: [
            {
              paths: [getValuesByName('Observations', ['Observations Comments'])]
            }
          ]
        }
      ]
    },
    {
      name: 'location',
      fields: [
        {
          columnName: 'eventID',
          columnValue: [
            {
              paths: [getValuesByName('Effort & Site Conditions', '_key')]
            }
          ]
        },
        {
          columnName: 'occurrenceID',
          columnValue: [
            {
              paths: [getValuesByName('Observations', ['_key'])]
            }
          ]
        },
        {
          columnName: 'verbatimCoordinates',
          columnValue: [
            {
              paths: [getValuesByName('Observations', ['UTM Zone ', 'Easting', 'Northing'])],
              join: ' '
            },
            {
              paths: [getValuesByName('Observations', ['Lat', 'Long'])],
              join: ' '
            }
          ]
        },
        {
          columnName: 'verbatimSRS',
          columnValue: [
            {
              paths: [getValuesByName('Observations', ['Datum'])]
            }
          ]
        }
      ]
    },
    {
      name: 'occurrence',
      condition: [{ if: getValuesByName('Observations', ['Yearling Bulls']) }],
      fields: [
        {
          columnName: 'eventID',
          columnValue: [
            {
              paths: [getValuesByName('Effort & Site Conditions', '_key')]
            }
          ]
        },
        {
          columnName: 'occurrenceID',
          columnValue: [
            {
              paths: [getValuesByName('Observations', ['_key'])],
              postfix: '1'
            }
          ]
        },
        createPathField('individualCount', 'Observations', ['Yearling Bulls']),
        createPathField('taxonID', 'Observations', ['Species']),
        createValueField('sex', 'male'),
        createValueField('lifeStage', 'yearling'),
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments']),
        createPathField('behavior', 'Observations', ['Activity'])
      ]
    },
    {
      name: 'occurrence',
      condition: [{ if: getValuesByName('Observations', ['Sub-Prime Bulls']) }],
      fields: [
        {
          columnName: 'eventID',
          columnValue: [
            {
              paths: [getValuesByName('Effort & Site Conditions', '_key')]
            }
          ]
        },
        {
          columnName: 'occurrenceID',
          columnValue: [
            {
              paths: [getValuesByName('Observations', ['_key'])],
              postfix: '2'
            }
          ]
        },
        createPathField('individualCount', 'Observations', ['Sub-Prime Bulls']),
        createPathField('taxonID', 'Observations', ['Species']),
        createValueField('sex', 'male'),
        createValueField('lifeStage', 'sub-prime'),
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments']),
        createPathField('behavior', 'Observations', ['Activity'])
      ]
    },
    {
      name: 'occurrence',
      condition: [{ if: getValuesByName('Observations', ['Prime Bulls']) }],
      fields: [
        {
          columnName: 'eventID',
          columnValue: [
            {
              paths: [getValuesByName('Effort & Site Conditions', '_key')]
            }
          ]
        },
        {
          columnName: 'occurrenceID',
          columnValue: [
            {
              paths: [getValuesByName('Observations', ['_key'])],
              postfix: '3'
            }
          ]
        },
        createPathField('individualCount', 'Observations', ['Prime Bulls']),
        createPathField('taxonID', 'Observations', ['Species']),
        createValueField('sex', 'male'),
        createValueField('lifeStage', 'prime'),
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments']),
        createPathField('behavior', 'Observations', ['Activity'])
      ]
    },
    {
      name: 'occurrence',
      condition: [{ if: getValuesByName('Observations', ['Senior Bulls']) }],
      fields: [
        {
          columnName: 'eventID',
          columnValue: [
            {
              paths: [getValuesByName('Effort & Site Conditions', '_key')]
            }
          ]
        },
        {
          columnName: 'occurrenceID',
          columnValue: [
            {
              paths: [getValuesByName('Observations', ['_key'])],
              postfix: '4'
            }
          ]
        },
        createPathField('individualCount', 'Observations', ['Senior Bulls']),
        createPathField('taxonID', 'Observations', ['Species']),
        createValueField('sex', 'male'),
        createValueField('lifeStage', 'senior'),
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments']),
        createPathField('behavior', 'Observations', ['Activity'])
      ]
    },
    {
      name: 'occurrence',
      condition: [{ if: getValuesByName('Observations', ['RISC Class I Bulls']) }],
      fields: [
        {
          columnName: 'eventID',
          columnValue: [
            {
              paths: [getValuesByName('Effort & Site Conditions', '_key')]
            }
          ]
        },
        {
          columnName: 'occurrenceID',
          columnValue: [
            {
              paths: [getValuesByName('Observations', ['_key'])],
              postfix: '5'
            }
          ]
        },
        createPathField('individualCount', 'Observations', ['RISC Class I Bulls']),
        createPathField('taxonID', 'Observations', ['Species']),
        createValueField('sex', 'male'),
        createValueField('lifeStage', 'juvenile'),
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments']),
        createPathField('behavior', 'Observations', ['Activity'])
      ]
    },
    {
      name: 'occurrence',
      condition: [{ if: getValuesByName('Observations', ['RISC Class II Bulls']) }],
      fields: [
        {
          columnName: 'eventID',
          columnValue: [
            {
              paths: [getValuesByName('Effort & Site Conditions', '_key')]
            }
          ]
        },
        {
          columnName: 'occurrenceID',
          columnValue: [
            {
              paths: [getValuesByName('Observations', ['_key'])],
              postfix: '6'
            }
          ]
        },
        createPathField('individualCount', 'Observations', ['RISC Class II Bulls']),
        createPathField('taxonID', 'Observations', ['Species']),
        createValueField('sex', 'male'),
        createValueField('lifeStage', 'juvenile'),
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments']),
        createPathField('behavior', 'Observations', ['Activity'])
      ]
    },
    {
      name: 'occurrence',
      condition: [{ if: getValuesByName('Observations', ['RISC Class III Bulls']) }],
      fields: [
        {
          columnName: 'eventID',
          columnValue: [
            {
              paths: [getValuesByName('Effort & Site Conditions', '_key')]
            }
          ]
        },
        {
          columnName: 'occurrenceID',
          columnValue: [
            {
              paths: [getValuesByName('Observations', ['_key'])],
              postfix: '7'
            }
          ]
        },
        createPathField('individualCount', 'Observations', ['RISC Class III Bulls']),
        createPathField('taxonID', 'Observations', ['Species']),
        createValueField('sex', 'male'),
        createValueField('lifeStage', 'juvenile'),
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments']),
        createPathField('behavior', 'Observations', ['Activity'])
      ]
    },
    {
      name: 'occurrence',
      condition: [{ if: getValuesByName('Observations', 'Oswald (1997) Class I Bulls') }],
      fields: [
        {
          columnName: 'eventID',
          columnValue: [
            {
              paths: [getValuesByName('Effort & Site Conditions', '_key')]
            }
          ]
        },
        {
          columnName: 'occurrenceID',
          columnValue: [
            {
              paths: [getValuesByName('Observations', ['_key'])],
              postfix: '8'
            }
          ]
        },
        createPathField('individualCount', 'Observations', ['Oswald (1997) Class I Bulls']),
        createPathField('taxonID', 'Observations', ['Species']),
        createValueField('sex', 'male'),
        createValueField('lifeStage', 'juvenile'),
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments']),
        createPathField('behavior', 'Observations', ['Activity'])
      ]
    },
    {
      name: 'occurrence',
      condition: [{ if: getValuesByName('Observations', 'Oswald (1997) Class II Bulls') }],
      fields: [
        {
          columnName: 'eventID',
          columnValue: [
            {
              paths: [getValuesByName('Effort & Site Conditions', '_key')]
            }
          ]
        },
        {
          columnName: 'occurrenceID',
          columnValue: [
            {
              paths: [getValuesByName('Observations', ['_key'])],
              postfix: '9'
            }
          ]
        },
        createPathField('individualCount', 'Observations', ['Oswald (1997) Class II Bulls']),
        createPathField('taxonID', 'Observations', ['Species']),
        createValueField('sex', 'male'),
        createValueField('lifeStage', 'juvenile'),
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments']),
        createPathField('behavior', 'Observations', ['Activity'])
      ]
    },
    {
      name: 'occurrence',
      condition: [{ if: getValuesByName('Observations', 'Oswald (1997) Class III Bulls') }],
      fields: [
        {
          columnName: 'eventID',
          columnValue: [
            {
              paths: [getValuesByName('Effort & Site Conditions', '_key')]
            }
          ]
        },
        {
          columnName: 'occurrenceID',
          columnValue: [
            {
              paths: [getValuesByName('Observations', ['_key'])],
              postfix: '10'
            }
          ]
        },
        createPathField('individualCount', 'Observations', ['Oswald (1997) Class III Bulls']),
        createPathField('taxonID', 'Observations', ['Species']),
        createValueField('sex', 'male'),
        createValueField('lifeStage', 'juvenile'),
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments']),
        createPathField('behavior', 'Observations', ['Activity'])
      ]
    },
    {
      name: 'occurrence',
      condition: [{ if: getValuesByName('Observations', ['Adult Bulls - Unclassified']) }],
      fields: [
        {
          columnName: 'eventID',
          columnValue: [
            {
              paths: [getValuesByName('Effort & Site Conditions', '_key')]
            }
          ]
        },
        {
          columnName: 'occurrenceID',
          columnValue: [
            {
              paths: [getValuesByName('Observations', ['_key'])],
              postfix: '11'
            }
          ]
        },
        createPathField('individualCount', 'Observations', ['Adult Bulls - Unclassified']),
        createPathField('taxonID', 'Observations', ['Species']),
        createValueField('sex', 'male'),
        createValueField('lifeStage', 'adult'),
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments']),
        createPathField('behavior', 'Observations', ['Activity'])
      ]
    },
    {
      name: 'occurrence',
      condition: [{ if: getValuesByName('Observations', ['Bulls - Unclassified']) }],
      fields: [
        {
          columnName: 'eventID',
          columnValue: [
            {
              paths: [getValuesByName('Effort & Site Conditions', '_key')]
            }
          ]
        },
        {
          columnName: 'occurrenceID',
          columnValue: [
            {
              paths: [getValuesByName('Observations', ['_key'])],
              postfix: '12'
            }
          ]
        },
        createPathField('individualCount', 'Observations', ['Bulls - Unclassified']),
        createPathField('taxonID', 'Observations', ['Species']),
        createValueField('sex', 'male'),
        createValueField('lifeStage', 'unknown bulls'),
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments']),
        createPathField('behavior', 'Observations', ['Activity'])
      ]
    },
    {
      name: 'occurrence',
      condition: [{ if: getValuesByName('Observations', ['Lone Cows']) }],
      fields: [
        {
          columnName: 'eventID',
          columnValue: [
            {
              paths: [getValuesByName('Effort & Site Conditions', '_key')]
            }
          ]
        },
        {
          columnName: 'occurrenceID',
          columnValue: [
            {
              paths: [getValuesByName('Observations', ['_key'])],
              postfix: '13'
            }
          ]
        },
        createPathField('individualCount', 'Observations', ['Lone Cows']),
        createPathField('taxonID', 'Observations', ['Species']),
        createValueField('sex', 'female'),
        createValueField('lifeStage', 'unknown'),
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments']),
        createPathField('behavior', 'Observations', ['Activity'])
      ]
    },
    {
      name: 'occurrence',
      condition: [{ if: getValuesByName('Observations', ['Lone calf']) }],
      fields: [
        {
          columnName: 'eventID',
          columnValue: [
            {
              paths: [getValuesByName('Effort & Site Conditions', '_key')]
            }
          ]
        },
        {
          columnName: 'occurrenceID',
          columnValue: [
            {
              paths: [getValuesByName('Observations', ['_key'])],
              postfix: '14'
            }
          ]
        },
        createPathField('individualCount', 'Observations', ['Lone calf']),
        createPathField('taxonID', 'Observations', ['Species']),
        createValueField('sex', 'male'),
        createValueField('lifeStage', 'juvenile'),
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments']),
        createPathField('behavior', 'Observations', ['Activity'])
      ]
    },
    {
      name: 'occurrence',
      condition: [{ if: getValuesByName('Observations', 'Cow W/1 calf') }],
      add: [
        {
          name: 'occurrence',
          fields: [
            {
              columnName: 'eventID',
              columnValue: [
                {
                  paths: [getValuesByName('Effort & Site Conditions', '_key')]
                }
              ]
            },
            {
              columnName: 'occurrenceID',
              columnValue: [
                {
                  paths: [getValuesByName('Observations', ['_key'])],
                  postfix: '15:1'
                }
              ]
            },
            createValueField('individualCount', '1'),
            createPathField('taxonID', 'Observations', ['Species']),
            createValueField('sex', 'unknown'),
            createValueField('lifeStage', 'juvenile'),
            createPathField('occurrenceRemarks', 'Observations', ['Observation Comments']),
            createPathField('behavior', 'Observations', ['Activity'])
          ]
        },
        {
          name: 'measurementOrFact',
          fields: [
            {
              columnName: 'eventID',
              columnValue: [
                {
                  paths: [getValuesByName('Effort & Site Conditions', '_key')]
                }
              ]
            },
            {
              columnName: 'occurrenceID',
              columnValue: [
                {
                  paths: [getValuesByName('Observations', ['_key'])],
                  postfix: '15:1'
                }
              ]
            },
            createValueField('measurementType', 'Veg Cover (%)'),
            createPathField('measurementValue', 'Observations', ['Veg Cover (%)']),
            createValueField('measurementUnit', '%')
          ]
        }
      ],
      fields: [
        {
          columnName: 'eventID',
          columnValue: [
            {
              paths: [getValuesByName('Effort & Site Conditions', '_key')]
            }
          ]
        },
        {
          columnName: 'occurrenceID',
          columnValue: [
            {
              paths: [getValuesByName('Observations', ['_key'])],
              postfix: '15'
            }
          ]
        },
        createPathField('individualCount', 'Observations', ['Cow W/1 calf']),
        createPathField('taxonID', 'Observations', ['Species']),
        createValueField('sex', 'female'),
        createValueField('lifeStage', 'adult'),
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments']),
        createPathField('behavior', 'Observations', ['Activity'])
      ]
    },
    {
      name: 'occurrence',
      condition: [{ if: getValuesByName('Observations', 'Cow W/2 calves') }],
      add: [
        {
          name: 'occurrence',
          fields: [
            {
              columnName: 'eventID',
              columnValue: [
                {
                  paths: [getValuesByName('Effort & Site Conditions', '_key')]
                }
              ]
            },
            {
              columnName: 'occurrenceID',
              columnValue: [
                {
                  paths: [getValuesByName('Observations', ['_key'])],
                  postfix: '16:1'
                }
              ]
            },
            createValueField('individualCount', '1'),
            createPathField('taxonID', 'Observations', ['Species']),
            createValueField('sex', 'unknown'),
            createValueField('lifeStage', 'juvenile'),
            createPathField('occurrenceRemarks', 'Observations', ['Observation Comments']),
            createPathField('behavior', 'Observations', ['Activity'])
          ]
        },
        {
          name: 'occurrence',
          fields: [
            {
              columnName: 'eventID',
              columnValue: [
                {
                  paths: [getValuesByName('Effort & Site Conditions', '_key')]
                }
              ]
            },
            {
              columnName: 'occurrenceID',
              columnValue: [
                {
                  paths: [getValuesByName('Observations', ['_key'])],
                  postfix: '16:2'
                }
              ]
            },
            createValueField('individualCount', '1'),
            createPathField('taxonID', 'Observations', ['Species']),
            createValueField('sex', 'unknown'),
            createValueField('lifeStage', 'juvenile'),
            createPathField('occurrenceRemarks', 'Observations', ['Observation Comments']),
            createPathField('behavior', 'Observations', ['Activity'])
          ]
        }
      ],
      fields: [
        {
          columnName: 'eventID',
          columnValue: [
            {
              paths: [getValuesByName('Effort & Site Conditions', '_key')]
            }
          ]
        },
        {
          columnName: 'occurrenceID',
          columnValue: [
            {
              paths: [getValuesByName('Observations', ['_key'])],
              postfix: '16'
            }
          ]
        },
        createPathField('individualCount', 'Observations', ['Cow W/2 calves']),
        createPathField('taxonID', 'Observations', ['Species']),
        createValueField('sex', 'female'),
        createValueField('lifeStage', 'adult'),
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments']),
        createPathField('behavior', 'Observations', ['Activity'])
      ]
    },
    {
      name: 'occurrence',
      condition: [{ if: getValuesByName('Observations', ['Adult Unclassified Sex']) }],
      fields: [
        {
          columnName: 'eventID',
          columnValue: [
            {
              paths: [getValuesByName('Effort & Site Conditions', '_key')]
            }
          ]
        },
        {
          columnName: 'occurrenceID',
          columnValue: [
            {
              paths: [getValuesByName('Observations', ['_key'])],
              postfix: '17'
            }
          ]
        },
        createPathField('individualCount', 'Observations', ['Adult Unclassified Sex']),
        createPathField('taxonID', 'Observations', ['Species']),
        createValueField('sex', 'unknown'),
        createValueField('lifeStage', 'adult'),
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments']),
        createPathField('behavior', 'Observations', ['Activity'])
      ]
    },
    {
      name: 'occurrence',
      condition: [{ if: getValuesByName('Observations', 'Unclassified Age/Sex') }],
      fields: [
        {
          columnName: 'eventID',
          columnValue: [
            {
              paths: [getValuesByName('Effort & Site Conditions', '_key')]
            }
          ]
        },
        {
          columnName: 'occurrenceID',
          columnValue: [
            {
              paths: [getValuesByName('Observations', ['_key'])],
              postfix: '18'
            }
          ]
        },
        createPathField('individualCount', 'Observations', ['Unclassified Age/Sex']),
        createPathField('taxonID', 'Observations', ['Species']),
        createValueField('sex', 'unknown'),
        createValueField('lifeStage', 'unknown'),
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments']),
        createPathField('behavior', 'Observations', ['Activity'])
      ]
    },
    {
      name: 'occurrence',
      condition: [{ if: getValuesByName('Observations', 'Spike/Fork Bulls') }],
      fields: [
        {
          columnName: 'eventID',
          columnValue: [
            {
              paths: [getValuesByName('Effort & Site Conditions', '_key')]
            }
          ]
        },
        {
          columnName: 'occurrenceID',
          columnValue: [
            {
              paths: [getValuesByName('Observations', ['_key'])],
              postfix: '19'
            }
          ]
        },
        createPathField('individualCount', 'Observations', ['Spike/Fork Bulls']),
        createPathField('taxonID', 'Observations', ['Species']),
        createValueField('sex', 'male'),
        createValueField('lifeStage', 'adult'),
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments']),
        createPathField('behavior', 'Observations', ['Activity'])
      ]
    },
    {
      name: 'occurrence',
      condition: [{ if: getValuesByName('Observations', '3 Brow/10 Points Bulls') }],
      fields: [
        {
          columnName: 'eventID',
          columnValue: [
            {
              paths: [getValuesByName('Effort & Site Conditions', '_key')]
            }
          ]
        },
        {
          columnName: 'occurrenceID',
          columnValue: [
            {
              paths: [getValuesByName('Observations', ['_key'])],
              postfix: '20'
            }
          ]
        },
        createPathField('individualCount', 'Observations', ['3 Brow/10 Points Bulls']),
        createPathField('taxonID', 'Observations', ['Species']),
        createValueField('sex', 'male'),
        createValueField('lifeStage', 'adult'),
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments']),
        createPathField('behavior', 'Observations', ['Activity'])
      ]
    },
    {
      name: 'occurrence',
      condition: [{ if: getValuesByName('Incidental Observations', 'Adult Males') }],
      fields: [
        {
          columnName: 'eventID',
          columnValue: [
            {
              paths: [getValuesByName('Effort & Site Conditions', '_key')]
            }
          ]
        },
        {
          columnName: 'occurrenceID',
          columnValue: [
            {
              paths: [getValuesByName('Incidental Observations', '_key')],
              postfix: 'INC:1'
            }
          ]
        },
        createPathField('individualCount', 'Incidental Observations', ['Adult Males']),
        createPathField('taxonID', 'Incidental Observations', ['Species']),
        createValueField('sex', 'male'),
        createValueField('lifeStage', 'adult'),
        createPathField('occurrenceRemarks', 'Incidental Observations', ['Incidental Observation Comments']),
        createPathField('behavior', 'Incidental Observations', ['Activity'])
      ]
    },
    {
      name: 'occurrence',
      condition: [{ if: getValuesByName('Incidental Observations', 'Adult Females') }],
      fields: [
        {
          columnName: 'eventID',
          columnValue: [
            {
              paths: [getValuesByName('Effort & Site Conditions', '_key')]
            }
          ]
        },
        {
          columnName: 'occurrenceID',
          columnValue: [
            {
              paths: [getValuesByName('Incidental Observations', '_key')],
              postfix: 'INC:2'
            }
          ]
        },
        createPathField('individualCount', 'Incidental Observations', ['Adult Females']),
        createPathField('taxonID', 'Incidental Observations', ['Species']),
        createValueField('sex', 'female'),
        createValueField('lifeStage', 'adult'),
        createPathField('occurrenceRemarks', 'Incidental Observations', ['Incidental Observation Comments']),
        createPathField('behavior', 'Incidental Observations', ['Activity'])
      ]
    },
    {
      name: 'occurrence',
      condition: [{ if: getValuesByName('Incidental Observations', 'Adults - Unclassified Sex') }],
      fields: [
        {
          columnName: 'eventID',
          columnValue: [
            {
              paths: [getValuesByName('Effort & Site Conditions', '_key')]
            }
          ]
        },
        {
          columnName: 'occurrenceID',
          columnValue: [
            {
              paths: [getValuesByName('Incidental Observations', '_key')],
              postfix: 'INC:3'
            }
          ]
        },
        createPathField('individualCount', 'Incidental Observations', ['Adults - Unclassified Sex']),
        createPathField('taxonID', 'Incidental Observations', ['Species']),
        createValueField('sex', 'unknown'),
        createValueField('lifeStage', 'adult'),
        createPathField('occurrenceRemarks', 'Incidental Observations', ['Incidental Observation Comments']),
        createPathField('behavior', 'Incidental Observations', ['Activity'])
      ]
    },
    {
      name: 'occurrence',
      condition: [{ if: getValuesByName('Incidental Observations', 'Juvenile Males') }],
      fields: [
        {
          columnName: 'eventID',
          columnValue: [
            {
              paths: [getValuesByName('Effort & Site Conditions', '_key')]
            }
          ]
        },
        {
          columnName: 'occurrenceID',
          columnValue: [
            {
              paths: [getValuesByName('Incidental Observations', '_key')],
              postfix: 'INC:4'
            }
          ]
        },
        createPathField('individualCount', 'Incidental Observations', ['Juvenile Males']),
        createPathField('taxonID', 'Incidental Observations', ['Species']),
        createValueField('sex', 'male'),
        createValueField('lifeStage', 'juvenile'),
        createPathField('occurrenceRemarks', 'Incidental Observations', ['Incidental Observation Comments']),
        createPathField('behavior', 'Incidental Observations', ['Activity'])
      ]
    },
    {
      name: 'occurrence',
      condition: [{ if: getValuesByName('Incidental Observations', 'Juvenile Females') }],
      fields: [
        {
          columnName: 'eventID',
          columnValue: [
            {
              paths: [getValuesByName('Effort & Site Conditions', '_key')]
            }
          ]
        },
        {
          columnName: 'occurrenceID',
          columnValue: [
            {
              paths: [getValuesByName('Incidental Observations', '_key')],
              postfix: 'INC:5'
            }
          ]
        },
        createPathField('individualCount', 'Incidental Observations', ['Juvenile Females']),
        createPathField('taxonID', 'Incidental Observations', ['Species']),
        createValueField('sex', 'female'),
        createValueField('lifeStage', 'juvenile'),
        createPathField('occurrenceRemarks', 'Incidental Observations', ['Incidental Observation Comments']),
        createPathField('behavior', 'Incidental Observations', ['Activity'])
      ]
    },
    {
      name: 'occurrence',
      condition: [{ if: getValuesByName('Incidental Observations', 'Juveniles - Unclassified Sex') }],
      fields: [
        {
          columnName: 'eventID',
          columnValue: [
            {
              paths: [getValuesByName('Effort & Site Conditions', '_key')]
            }
          ]
        },
        {
          columnName: 'occurrenceID',
          columnValue: [
            {
              paths: [getValuesByName('Incidental Observations', '_key')],
              postfix: 'INC:6'
            }
          ]
        },
        createPathField('individualCount', 'Incidental Observations', ['Juveniles - Unclassified Sex']),
        createPathField('taxonID', 'Incidental Observations', ['Species']),
        createValueField('sex', 'unknown'),
        createValueField('lifeStage', 'juvenile'),
        createPathField('occurrenceRemarks', 'Incidental Observations', ['Incidental Observation Comments']),
        createPathField('behavior', 'Incidental Observations', ['Activity'])
      ]
    },
    {
      name: 'occurrence',
      condition: [{ if: getValuesByName('Incidental Observations', 'Unknown Age/Sex') }],
      fields: [
        {
          columnName: 'eventID',
          columnValue: [
            {
              paths: [getValuesByName('Effort & Site Conditions', '_key')]
            }
          ]
        },
        {
          columnName: 'occurrenceID',
          columnValue: [
            {
              paths: [getValuesByName('Incidental Observations', '_key')],
              postfix: 'INC:7'
            }
          ]
        },
        createPathField('individualCount', 'Incidental Observations', ['Unknown Age/Sex']),
        createPathField('taxonID', 'Incidental Observations', ['Species']),
        createValueField('sex', 'unknown'),
        createValueField('lifeStage', 'unknown'),
        createPathField('occurrenceRemarks', 'Incidental Observations', ['Incidental Observation Comments']),
        createPathField('behavior', 'Incidental Observations', ['Activity'])
      ]
    },
    {
      name: 'measurementOrFact',
      fields: [
        {
          columnName: 'eventID',
          columnValue: [
            {
              paths: [getValuesByName('Effort & Site Conditions', '_key')]
            }
          ]
        },
        {
          columnName: 'occurrenceID',
          columnValue: [
            {
              paths: [getValuesByName('Observations', ['_key'])]
            }
          ]
        },
        createValueField('measurementType', 'Veg Cover'),
        createPathField('measurementValue', 'Observations', ['Veg Cover (%)']),
        createValueField('measurementUnit', '%')
      ]
    },
    {
      name: 'measurementOrFact',
      fields: [
        {
          columnName: 'eventID',
          columnValue: [
            {
              paths: [getValuesByName('Effort & Site Conditions', '_key')]
            }
          ]
        },
        {
          columnName: 'occurrenceID',
          columnValue: [
            {
              paths: [getValuesByName('Observations', ['_key'])]
            }
          ]
        },
        createValueField('measurementType', 'Snow Cover'),
        createPathField('measurementValue', 'Observations', ['Snow Cover (%)']),
        createValueField('measurementUnit', '%')
      ]
    },
    {
      name: 'measurementOrFact',
      fields: [
        {
          columnName: 'eventID',
          columnValue: [
            {
              paths: [getValuesByName('Effort & Site Conditions', '_key')]
            }
          ]
        },
        {
          columnName: 'occurrenceID',
          columnValue: [
            {
              paths: [getValuesByName('Observations', ['_key'])]
            }
          ]
        },
        createValueField('measurementType', 'Perpendicular Distance from Transect'),
        createPathField('measurementValue', 'Observations', ['Perpendicular Distance From Transect Line (m)']),
        createValueField('measurementUnit', 'm')
      ]
    },
    {
      name: 'measurementOrFact',
      fields: [
        {
          columnName: 'eventID',
          columnValue: [
            {
              paths: [getValuesByName('Effort & Site Conditions', '_key')]
            }
          ]
        },
        {
          columnName: 'occurrenceID',
          columnValue: [
            {
              paths: [getValuesByName('Observations', ['_key'])]
            }
          ]
        },
        createValueField('measurementType', 'Total Distance Flown'),
        createPathField('measurementValue', 'Observations', ['Total Distance Flown (km)']),
        createValueField('measurementUnit', 'km')
      ]
    },
    {
      name: 'measurementOrFact',
      fields: [
        {
          columnName: 'eventID',
          columnValue: [
            {
              paths: [getValuesByName('Effort & Site Conditions', '_key')]
            }
          ]
        },
        {
          columnName: 'occurrenceID',
          columnValue: [
            {
              paths: [getValuesByName('Observations', ['_key'])]
            }
          ]
        },
        createValueField('measurementType', 'Total Time'),
        createPathField('measurementValue', 'Effort & Site Conditions', ['Total Time (hours)']),
        createValueField('measurementUnit', 'hrs')
      ]
    },
    {
      name: 'measurementOrFact',
      fields: [
        {
          columnName: 'eventID',
          columnValue: [
            {
              paths: [getValuesByName('Effort & Site Conditions', '_key')]
            }
          ]
        },
        {
          columnName: 'occurrenceID',
          columnValue: [
            {
              paths: [getValuesByName('Observations', ['_key'])]
            }
          ]
        },
        createValueField('measurementType', 'Total Time'),
        createPathField('measurementValue', 'Effort & Site Conditions', ['Total Time (mins)']),
        createValueField('measurementUnit', 'mins')
      ]
    },
    {
      name: 'measurementOrFact',
      fields: [
        {
          columnName: 'eventID',
          columnValue: [
            {
              paths: [getValuesByName('Effort & Site Conditions', '_key')]
            }
          ]
        },
        {
          columnName: 'occurrenceID',
          columnValue: [
            {
              paths: [getValuesByName('Observations', ['_key'])]
            }
          ]
        },
        createValueField('measurementType', 'Time'),
        createPathField('measurementValue', 'Effort & Site Conditions', ['Total Time (hours)']),
        createValueField('measurementUnit', 'hrs')
      ]
    },
    {
      name: 'measurementOrFact',
      fields: [
        {
          columnName: 'eventID',
          columnValue: [
            {
              paths: [getValuesByName('Effort & Site Conditions', '_key')]
            }
          ]
        },
        {
          columnName: 'occurrenceID',
          columnValue: [
            {
              paths: [getValuesByName('Observations', ['_key'])]
            }
          ]
        },
        createValueField('measurementType', 'Time'),
        createPathField('measurementValue', 'Effort & Site Conditions', ['Time (mins)/km']),
        createValueField('measurementUnit', 'km/mins')
      ]
    },
    {
      name: 'measurementOrFact',
      fields: [
        {
          columnName: 'eventID',
          columnValue: [
            {
              paths: [getValuesByName('Effort & Site Conditions', '_key')]
            }
          ]
        },
        {
          columnName: 'occurrenceID',
          columnValue: [
            {
              paths: [getValuesByName('Observations', ['_key'])]
            }
          ]
        },
        createValueField('measurementType', 'Snow Cover'),
        createPathField('measurementValue', 'Effort & Site Conditions', ['Snow Cover']),
        createValueField('measurementUnit', '%')
      ]
    }
  ],
  dwcMeta: [
    {
      name: 'record-level',
      primaryKey: ['eventID', 'occurrenceID']
    },
    {
      name: 'event',
      primaryKey: ['eventID']
    },
    {
      name: 'occurrence',
      primaryKey: ['occurrenceID']
    },
    {
      name: 'location',
      primaryKey: ['occurrenceID']
    },
    {
      name: 'measurementOrFact',
      primaryKey: ['eventID', 'occurrenceID']
    }
  ]
};
