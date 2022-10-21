import { createPathField, createValueField, getMultipleValuesByName, getValueByName } from '../json-path-queries';
import { TransformSchema } from '../schema-utils';

export const schema: TransformSchema = {
  templateMeta: [
    {
      name: 'Block Summary',
      primaryKey: ['Study Area', 'Block ID/SU ID', 'Stratum'],
      parentKey: [],
      type: 'root',
      foreignKeys: [
        {
          name: 'Strata Metadata',
          primaryKey: ['Stratum']
        },
        {
          name: 'Effort & Site Conditions',
          primaryKey: ['Study Area', 'Block ID/SU ID']
        }
      ]
    },
    {
      name: 'Strata Metadata',
      primaryKey: ['Stratum'],
      parentKey: ['Stratum'],
      type: '',
      foreignKeys: []
    },
    {
      name: 'Effort & Site Conditions',
      primaryKey: ['Study Area', 'Block ID/SU ID'],
      parentKey: ['Study Area', 'Block ID/SU ID'],
      type: '',
      foreignKeys: [
        {
          name: 'Observations',
          primaryKey: ['Study Area', 'Block ID/SU ID']
        }
      ]
    },
    {
      name: 'Observations',
      primaryKey: ['GPS Unit Name', 'Waypoint'],
      parentKey: ['Study Area', 'Block ID/SU ID'],
      type: '',
      foreignKeys: [
        {
          name: 'UTM_LatLong',
          primaryKey: ['GPS Unit Name', 'Waypoint']
        }
      ]
    },
    {
      name: 'UTM_LatLong',
      primaryKey: ['GPS Unit Name', 'Waypoint'],
      parentKey: ['GPS Unit Name', 'Waypoint'],
      type: '',
      foreignKeys: [
        {
          name: 'Marked Animals',
          primaryKey: ['GPS Unit Name', 'Waypoint']
        }
      ]
    },
    {
      name: 'Marked Animals',
      primaryKey: ['WLH ID'],
      parentKey: ['GPS Unit Name', 'Waypoint'],
      type: '',
      foreignKeys: []
    }
  ],
  map: [
    {
      name: 'event',
      fields: [
        {
          columnName: 'eventID',
          columnValue: [
            {
              paths: [getValueByName('Block Summary', '_key')]
            }
          ]
        },
        {
          columnName: 'eventDate',
          columnValue: [
            {
              paths: [getValueByName('Effort & Site Conditions', 'Date')]
            }
          ]
        },
        {
          columnName: 'eventRemarks',
          columnValue: [
            {
              paths: [getValueByName('Effort & Site Conditions', 'Effort & Site Comments')]
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
              paths: [getValueByName('Block Summary', '_key')]
            }
          ]
        },
        {
          columnName: 'verbatimCoordinates',
          columnValue: [
            {
              paths: [getMultipleValuesByName('UTM_LatLong', ['UTM Zone ', 'Easting', 'Northing'])]
            },
            {
              paths: [getMultipleValuesByName('UTM_LatLong', ['Lat', 'Long'])]
            }
          ]
        },
        {
          columnName: 'verbatimSRS',
          columnValue: [
            {
              paths: [getValueByName('UTM_LatLong', 'GPS Datum')]
            }
          ]
        },
        {
          columnName: 'verbatimElevation',
          columnValue: [
            {
              paths: [getValueByName('UTM_LatLong', 'Waypoint Elevation (m)')]
            }
          ]
        },
        {
          columnName: 'locationRemarks',
          columnValue: [
            {
              paths: [getValueByName('UTM_LatLong', 'Location Comments')]
            }
          ]
        }
      ]
    },
    {
      name: 'occurrence',
      condition: [{ if: getValueByName('Observations', 'Cow W/1 calf') }],
      add: [
        {
          name: 'occurrence',
          fields: [
            {
              columnName: 'eventID',
              columnValue: [
                {
                  paths: [getValueByName('Block Summary', '_key')]
                }
              ]
            },
            {
              columnName: 'occurrenceID',
              columnValue: [
                {
                  paths: [getValueByName('Observations', '_key')],
                  postfix: '1'
                }
              ]
            },
            {
              columnName: 'individualCount',
              columnValue: [
                {
                  value: '1'
                }
              ]
            },
            {
              columnName: 'sex',
              columnValue: [
                {
                  value: 'unknown'
                }
              ]
            },
            {
              columnName: 'lifeStage',
              columnValue: [
                {
                  value: 'juvenile'
                }
              ]
            },
            {
              columnName: 'occurrenceRemarks',
              columnValue: [
                {
                  paths: [getValueByName('Observations', 'Observation Comments')]
                }
              ]
            }
          ]
        },
        {
          name: 'measurementOrFact',
          fields: [
            {
              columnName: 'eventID',
              columnValue: [
                {
                  paths: [getValueByName('Block Summary', '_key')]
                }
              ]
            },
            {
              columnName: 'occurrenceID',
              columnValue: [
                {
                  paths: [getValueByName('Observations', '_key')],
                  postfix: '1'
                }
              ]
            },
            {
              columnName: 'measurementType',
              columnValue: [
                {
                  value: '% Veg Cover'
                }
              ]
            },
            {
              columnName: 'measurementValue',
              columnValue: [
                {
                  paths: [getValueByName('Observations', '% Veg Cover')]
                }
              ]
            },
            {
              columnName: 'measurementUnit',
              columnValue: [
                {
                  value: '%'
                }
              ]
            }
          ]
        },
        {
          name: 'measurementOrFact',
          fields: [
            {
              columnName: 'eventID',
              columnValue: [
                {
                  paths: [getValueByName('Block Summary', '_key')]
                }
              ]
            },
            {
              columnName: 'occurrenceID',
              columnValue: [
                {
                  paths: [getValueByName('Observations', '_key')],
                  postfix: '1'
                }
              ]
            },
            {
              columnName: 'measurementType',
              columnValue: [
                {
                  value: '% Snow Cover'
                }
              ]
            },
            {
              columnName: 'measurementValue',
              columnValue: [
                {
                  paths: [getValueByName('Observations', '% Snow Cover')]
                }
              ]
            },
            {
              columnName: 'measurementUnit',
              columnValue: [
                {
                  value: '%'
                }
              ]
            }
          ]
        }
      ],
      fields: [
        {
          columnName: 'eventID',
          columnValue: [
            {
              paths: [getValueByName('Block Summary', '_key')]
            }
          ]
        },
        {
          columnName: 'occurrenceID',
          columnValue: [
            {
              paths: [getValueByName('Observations', '_key')],
              postfix: '0'
            }
          ]
        },
        {
          columnName: 'individualCount',
          columnValue: [
            {
              paths: [getValueByName('Observations', 'Cow W/1 calf')]
            }
          ]
        },
        {
          columnName: 'sex',
          columnValue: [
            {
              value: 'female'
            }
          ]
        },
        {
          columnName: 'lifeStage',
          columnValue: [
            {
              value: 'adult'
            }
          ]
        },
        {
          columnName: 'occurrenceRemarks',
          columnValue: [
            {
              paths: [getValueByName('Observations', 'Observation Comments')]
            }
          ]
        }
      ]
    },
    {
      name: 'occurrence',
      condition: [{ if: getValueByName('Observations', 'Yearling Bulls')}],
      fields: [
        {
          columnName: 'eventID',
          columnValue: [
            {
              paths: [getValueByName('Block Summary', '_key')]
            }
          ]
        },
        {
          columnName: 'occurrenceID',
          columnValue: [
            {
              paths: [getValueByName('Observations', '_key')],
              postfix: '2'
            }
          ]
        },
        createPathField('individualCount', 'Observations', ['Yearling Bulls']),
        createValueField('sex', 'male'),
        createValueField('lifeStage', 'juvenile'),
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments'])
      ]
    },
    {
      name: 'occurrence',
      condition: [{ if: getValueByName('Observations', 'Adult Bulls - Unclassified')}],
      fields: [
        {
          columnName: 'eventID',
          columnValue: [
            {
              paths: [getValueByName('Block Summary', '_key')]
            }
          ]
        },
        {
          columnName: 'occurrenceID',
          columnValue: [
            {
              paths: [getValueByName('Observations', '_key')],
              postfix: '3'
            }
          ]
        },
        createPathField('individualCount', 'Observations', ['Adult Bulls - Unclassified']),
        createValueField('sex', 'male'),
        createValueField('lifeStage', 'adult'),
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments'])
      ]
    },
    {
      name: 'occurrence',
      condition: [{ if: getValueByName('Observations', 'Sub-Prime Bulls')}],
      fields: [
        {
          columnName: 'eventID',
          columnValue: [
            {
              paths: [getValueByName('Block Summary', '_key')]
            }
          ]
        },
        {
          columnName: 'occurrenceID',
          columnValue: [
            {
              paths: [getValueByName('Observations', '_key')],
              postfix: '4'
            }
          ]
        },
        createPathField('individualCount', 'Observations', ['Sub-Prime Bulls']),
        createValueField('sex', 'male'),
        createValueField('lifeStage', 'adult'),
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments'])
      ]
    },
    {
      name: 'occurrence',
      condition: [{ if: getValueByName('Observations', 'Prime Bulls')}],
      fields: [
        {
          columnName: 'eventID',
          columnValue: [
            {
              paths: [getValueByName('Block Summary', '_key')]
            }
          ]
        },
        {
          columnName: 'occurrenceID',
          columnValue: [
            {
              paths: [getValueByName('Observations', '_key')],
              postfix: '5'
            }
          ]
        },
        createPathField('individualCount', 'Observations', ['Prime Bulls']),
        createValueField('sex', 'male'),
        createValueField('lifeStage', 'adult'),
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments'])
      ]
    },
    {
      name: 'occurrence',
      condition: [{ if: getValueByName('Observations', 'Senior Bulls')}],
      fields: [
        {
          columnName: 'eventID',
          columnValue: [
            {
              paths: [getValueByName('Block Summary', '_key')]
            }
          ]
        },
        {
          columnName: 'occurrenceID',
          columnValue: [
            {
              paths: [getValueByName('Observations', '_key')],
              postfix: '6'
            }
          ]
        },
        createPathField('individualCount', 'Observations', ['Senior Bulls']),
        createValueField('sex', 'male'),
        createValueField('lifeStage', 'adult'),
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments'])
      ]
    },
    {
      name: 'occurrence',
      condition: [{ if: getValueByName('Observations', 'Bulls - Unclassified')}],
      fields: [
        {
          columnName: 'eventID',
          columnValue: [
            {
              paths: [getValueByName('Block Summary', '_key')]
            }
          ]
        },
        {
          columnName: 'occurrenceID',
          columnValue: [
            {
              paths: [getValueByName('Observations', '_key')],
              postfix: '7'
            }
          ]
        },
        createPathField('individualCount', 'Observations', ['Bulls - Unclassified']),
        createValueField('sex', 'male'),
        createValueField('lifeStage', 'unknown'),
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments'])
      ]
    },
    {
      name: 'occurrence',
      condition: [{ if: getValueByName('Observations', 'Lone Cows')}],
      fields: [
        {
          columnName: 'eventID',
          columnValue: [
            {
              paths: [getValueByName('Block Summary', '_key')]
            }
          ]
        },
        {
          columnName: 'occurrenceID',
          columnValue: [
            {
              paths: [getValueByName('Observations', '_key')],
              postfix: '8'
            }
          ]
        },
        createPathField('individualCount', 'Observations', ['Lone Cows']),
        createValueField('sex', 'female'),
        createValueField('lifeStage', 'adult'),
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments'])
      ]
    },
    {
      name: 'occurrence',
      condition: [{ if: getValueByName('Observations', 'Lone calf')}],
      fields: [
        {
          columnName: 'eventID',
          columnValue: [
            {
              paths: [getValueByName('Block Summary', '_key')]
            }
          ]
        },
        {
          columnName: 'occurrenceID',
          columnValue: [
            {
              paths: [getValueByName('Observations', '_key')],
              postfix: '9'
            }
          ]
        },
        createPathField('individualCount', 'Observations', ['Lone calf']),
        createValueField('sex', 'female'),
        createValueField('lifeStage', 'adult'),
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments'])
      ]
    },
    {
      name: 'occurrence',
      condition: [{ if: getValueByName('Observations', 'Unclassified')}],
      fields: [
        {
          columnName: 'eventID',
          columnValue: [
            {
              paths: [getValueByName('Block Summary', '_key')]
            }
          ]
        },
        {
          columnName: 'occurrenceID',
          columnValue: [
            {
              paths: [getValueByName('Observations', '_key')],
              postfix: '10'
            }
          ]
        },
        createPathField('individualCount', 'Observations', ['Unclassified']),
        createValueField('sex', 'unknown'),
        createValueField('lifeStage', 'unknown'),
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments'])
      ]
    },
    {
      name: 'occurrence',
      condition: [{ if: getValueByName('Observations', 'No. Spike/Fork')}],
      fields: [
        {
          columnName: 'eventID',
          columnValue: [
            {
              paths: [getValueByName('Block Summary', '_key')]
            }
          ]
        },
        {
          columnName: 'occurrenceID',
          columnValue: [
            {
              paths: [getValueByName('Observations', '_key')],
              postfix: '11'
            }
          ]
        },
        createPathField('individualCount', 'Observations', ['No. Spike/Fork']),
        createValueField('sex', 'male'),
        createValueField('lifeStage', 'unknown'),
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments'])
      ]
    },
    {
      name: 'occurrence',
      condition: [{ if: getValueByName('Observations', '3 brow/10 points')}],
      fields: [
        {
          columnName: 'eventID',
          columnValue: [
            {
              paths: [getValueByName('Block Summary', '_key')]
            }
          ]
        },
        {
          columnName: 'occurrenceID',
          columnValue: [
            {
              paths: [getValueByName('Observations', '_key')],
              postfix: '12'
            }
          ]
        },
        createPathField('individualCount', 'Observations', ['3 brow/10 points']),
        createValueField('sex', 'male'),
        createValueField('lifeStage', 'adult'),
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments'])
      ]
    },
    {
      name: 'measurementOrFact',
      fields: [
        {
          columnName: 'eventID',
          columnValue: [
            {
              paths: [getValueByName('Effort & Site Conditions ', '_key')]
            }
          ]
        },
        {
          columnName: 'occurrenceID',
          columnValue: [
            {
              paths: [getValueByName('Observations', '_key')],
              postfix: 'MF:1'
            }
          ]
        },
        createValueField('measurementType', '% Veg Cover'),
        createPathField('measurementValue', 'Observations', ['% Veg Cover']),
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
              paths: [getValueByName('Effort & Site Conditions ', '_key')]
            }
          ]
        },
        {
          columnName: 'occurrenceID',
          columnValue: [
            {
              paths: [getValueByName('Observations', '_key')],
              postfix: 'MF:2'
            }
          ]
        },
        createValueField('measurementType', '% Snow Cover'),
        createPathField('measurementValue', 'Observations', ['% Snow Cover']),
        createValueField('measurementUnit', '%')
      ]
    },
  ],
  dwcMeta: [
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
      primaryKey: ['eventID']
    },
    {
      name: 'measurementOrFact',
      primaryKey: ['eventID', 'occurrenceID']
    }
  ]
};
