import { createPathField, createValueField, getMultipleValuesByName, getValueByName } from '../json-path-queries';
import { SheetSchema, TransformSchema } from '../schema-utils';


const createChildrenSheets = () => {

}

const createSheet = (name: string, keys: string[], parentKeys: string[], type: 'root' | 'leaf' | '', foreignKeys: {name: string, primaryKey: string[]}[]): SheetSchema => {
  return {
    name,
    primaryKey: keys,
    parentKey: parentKeys,
    type, 
    foreignKeys
  } as SheetSchema;
}

export const schema: TransformSchema = {
  sheets: [
    {
      name: 'Effort & Site Conditions',
      primaryKey: ['Study Area', 'Date'],
      parentKey: [],
      type: 'root',
      foreignKeys: [
        {
          name: 'Observations',
          primaryKey: ['Study Area', 'Date']
        }
      ]
    },
    {
      name: 'Observations',
      primaryKey: ['Study Area', 'Block ID/SU ID', 'Transect ID'],
      parentKey: ['Study Area', 'Date'],
      type: '',
      foreignKeys: [
        {
          name: 'Marked Animals',
          primaryKey: ['Study Area', 'Transect ID']
        }
      ]
    },
    {
      name: 'Marked Animals',
      primaryKey: ['Study Area', 'Transect ID'],
      parentKey: ['Study Area', 'Transect ID'],
      type: '',
      foreignKeys: []
    },
    // {
    //   name: 'Incidental Observations',
    //   primaryKey: [],
    //   parentKey: [],
    //   type: '',
    //   foreignKeys: []
    // }
  ],
  map: [
    {
      // are certain things required for DwC objects? like if an event is present we need to have at least 3 of the event properties or are we just trying to fill as many of the dwc properties we can?
      // what if we can't find a proper unique identifier for a sheet? is that when it becomes a leaf? just to roll it all up?
      // do we have a list of bare minimum fields we need for biohhub? I guess it just w/e we can get from it
      // coordinates, species? that is assumed per template kinda...
      // the add for the maps, are there other special functions we could leverage?
      // is the incidental sheet self contained or should it be apart of the OG transform?
      // effort & site conditions, what makes this particular page unique? can they have two of the same days
      // bulls - unclassified missing a single item because transect ID 4 is repeated
      // lone cows missing a single item because transect ID is repeated
      // what life stage are the RISC/ Oswald Bulls?
      name: 'event',
      fields: [
        {
          columnName: 'eventID',
          columnValue: [
            {
              paths: [getValueByName('Observations', '_key')]
            }
          ]
        },
        {
          columnName: 'eventDate',
          columnValue: [
            {
              paths: [getValueByName('Observations', 'Date')]
            }
          ]
        },
        {
          columnName: 'eventRemarks',
          columnValue: [
            {
              paths: [getValueByName('Observations', 'Observations Comments')]
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
              paths: [getValueByName('Effort & Site Conditions', '_key')]
            }
          ]
        },
        {
          columnName: 'occurrenceID',
          columnValue: [
            {
              paths: [getValueByName('Observations', '_key')]
            }
          ]
        },
        {
          columnName: 'verbatimCoordinates',
          columnValue: [
            {
              paths: [getMultipleValuesByName('Observations', ['UTM Zone ', 'Easting', 'Northing'])],
              join: ' '
            },
            {
              paths: [getMultipleValuesByName('Observations', ['Lat', 'Long '])],
              join: ' '
            }
          ]
        },
        {
          columnName: 'verbatimSRS',
          columnValue: [
            {
              paths: [getValueByName('Observations', 'Datum')]
            }
          ]
        }
      ]
    },
    {
      name: 'occurrence',
      condition:[{ if: getValueByName('Observations', 'Yearling Bulls')}],
      fields: [
        {
          columnName: 'eventID',
          columnValue: [
            {
              paths: [getValueByName('Effort & Site Conditions', '_key')]
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
              paths: [getValueByName('Observations', 'Yearling Bulls')]
            }
          ]
        },
        createValueField('sex', 'male'),
        createValueField('lifeStage', 'yearling'),
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
      condition:[{ if: getValueByName('Observations', 'Sub-Prime Bulls')}],
      fields: [
        {
          columnName: 'eventID',
          columnValue: [
            {
              paths: [getValueByName('Effort & Site Conditions', '_key')]
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
        createPathField('individualCount', 'Observations', ['Sub-Prime Bulls']),
        createValueField('sex', 'male'),
        createValueField('lifeStage', 'sub-prime'),
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments'])
      ]
    },
    {
      name: 'occurrence',
      condition:[{ if: getValueByName('Observations', 'Prime Bulls')}],
      fields: [
        {
          columnName: 'eventID',
          columnValue: [
            {
              paths: [getValueByName('Effort & Site Conditions', '_key')]
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
        createPathField('individualCount', 'Observations', ['Prime Bulls']),
        createValueField('sex', 'male'),
        createValueField('lifeStage', 'prime'),
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments'])
      ]
    },
    {
      name: 'occurrence',
      condition:[{ if: getValueByName('Observations', 'Senior Bulls')}],
      fields: [
        {
          columnName: 'eventID',
          columnValue: [
            {
              paths: [getValueByName('Effort & Site Conditions', '_key')]
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
        createPathField('individualCount', 'Observations', ['Senior Bulls']),
        createValueField('sex', 'male'),
        createValueField('lifeStage', 'senior'),
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments'])
      ]
    },
    {
      name: 'occurrence',
      condition:[{ if: getValueByName('Observations', 'RISC Class I Bulls')}],
      fields: [
        {
          columnName: 'eventID',
          columnValue: [
            {
              paths: [getValueByName('Effort & Site Conditions', '_key')]
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
        createPathField('individualCount', 'Observations', ['RISC Class I Bulls']),
        createValueField('sex', 'male'),
        createValueField('lifeStage', 'juvenile'),
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments'])
      ]
    },
    {
      name: 'occurrence',
      condition:[{ if: getValueByName('Observations', 'RISC Class II Bulls')}],
      fields: [
        {
          columnName: 'eventID',
          columnValue: [
            {
              paths: [getValueByName('Effort & Site Conditions', '_key')]
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
        createPathField('individualCount', 'Observations', ['RISC Class II Bulls']),
        createValueField('sex', 'male'),
        createValueField('lifeStage', 'juvenile'),
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments'])
      ]
    },
    {
      name: 'occurrence',
      condition:[{ if: getValueByName('Observations', 'RISC Class III Bulls')}],
      fields: [
        {
          columnName: 'eventID',
          columnValue: [
            {
              paths: [getValueByName('Effort & Site Conditions', '_key')]
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
        createPathField('individualCount', 'Observations', ['RISC Class III Bulls']),
        createValueField('sex', 'male'),
        createValueField('lifeStage', 'juvenile'),
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments'])
      ]
    },
    {
      name: 'occurrence',
      condition:[{ if: getValueByName('Observations', 'Oswald (1997) Class I Bulls')}],
      fields: [
        {
          columnName: 'eventID',
          columnValue: [
            {
              paths: [getValueByName('Effort & Site Conditions', '_key')]
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
        createPathField('individualCount', 'Observations', ['Oswald (1997) Class I Bulls']),
        createValueField('sex', 'male'),
        createValueField('lifeStage', 'juvenile'),
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments'])
      ]
    },
    {
      name: 'occurrence',
      condition:[{ if: getValueByName('Observations', 'Oswald (1997) Class II Bulls')}],
      fields: [
        {
          columnName: 'eventID',
          columnValue: [
            {
              paths: [getValueByName('Effort & Site Conditions', '_key')]
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
        createPathField('individualCount', 'Observations', ['Oswald (1997) Class II Bulls']),
        createValueField('sex', 'male'),
        createValueField('lifeStage', 'juvenile'),
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments'])
      ]
    },
    {
      name: 'occurrence',
      condition:[{ if: getValueByName('Observations', 'Oswald (1997) Class III Bulls')}],
      fields: [
        {
          columnName: 'eventID',
          columnValue: [
            {
              paths: [getValueByName('Effort & Site Conditions', '_key')]
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
        createPathField('individualCount', 'Observations', ['Oswald (1997) Class III Bulls']),
        createValueField('sex', 'male'),
        createValueField('lifeStage', 'juvenile'),
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments'])
      ]
    },
    {
      name: 'occurrence',
      condition:[{ if: getValueByName('Observations', 'Adult Bulls - Unclassified')}],
      fields: [
        {
          columnName: 'eventID',
          columnValue: [
            {
              paths: [getValueByName('Effort & Site Conditions', '_key')]
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
        createPathField('individualCount', 'Observations', ['Adult Bulls - Unclassified']),
        createValueField('sex', 'male'),
        createValueField('lifeStage', 'adult'),
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments'])
      ]
    },
    {
      name: 'occurrence',
      condition:[{ if: getValueByName('Observations', 'Bulls - Unclassified')}],
      fields: [
        {
          columnName: 'eventID',
          columnValue: [
            {
              paths: [getValueByName('Effort & Site Conditions', '_key')]
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
        createPathField('individualCount', 'Observations', ['Bulls - Unclassified']),
        createValueField('sex', 'male'),
        createValueField('lifeStage', 'unknown bulls'),
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments'])
      ]
    },
    {
      name: 'occurrence',
      condition:[{ if: getValueByName('Observations', 'Lone Cows')}],
      fields: [
        {
          columnName: 'eventID',
          columnValue: [
            {
              paths: [getValueByName('Effort & Site Conditions', '_key')]
            }
          ]
        },
        {
          columnName: 'occurrenceID',
          columnValue: [
            {
              paths: [getValueByName('Observations', '_key')],
              postfix: '13'
            }
          ]
        },
        createPathField('individualCount', 'Observations', ['Lone Cows']),
        createValueField('sex', 'female'),
        createValueField('lifeStage', 'unknown'),
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments'])
      ]
    },
    {
      name: 'occurrence',
      condition:[{ if: getValueByName('Observations', 'Lone calf')}],
      fields: [
        {
          columnName: 'eventID',
          columnValue: [
            {
              paths: [getValueByName('Effort & Site Conditions', '_key')]
            }
          ]
        },
        {
          columnName: 'occurrenceID',
          columnValue: [
            {
              paths: [getValueByName('Observations', '_key')],
              postfix: '14'
            } 
          ]
        },
        createPathField('individualCount', 'Observations', ['Lone calf']),
        createValueField('sex', 'male'),
        createValueField('lifeStage', 'juvenile'),
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments'])
      ]
    },
    {
      name: 'occurrence',
      condition:[{ if: getValueByName('Observations', 'Cow W/1 calf')}],
      add: [
        {
          name: 'occurrence',
          fields: [
            {
              columnName: 'eventID',
              columnValue: [
                {
                  paths: [getValueByName('Effort & Site Conditions', '_key')]
                }
              ]
            },
            {
              columnName: 'occurrenceID',
              columnValue: [
                {
                  paths: [getValueByName('Observations', '_key')],
                  postfix: '15:1'
                }
              ]
            },
            createValueField('individualCount', '1'),
            createValueField('sex', 'unknown'),
            createValueField('lifeStage', 'juvenile'),
            createPathField('occurrenceRemarks', 'Observations', ['Observation Comments'])
          ]
        }
      ],
      fields: [
        {
          columnName: 'eventID',
          columnValue: [
            {
              paths: [getValueByName('Effort & Site Conditions', '_key')]
            }
          ]
        },
        {
          columnName: 'occurrenceID',
          columnValue: [
            {
              paths: [getValueByName('Observations', '_key')],
              postfix: '15'
            }
          ]
        },
        createPathField('individualCount', 'Observations', ['Cow W/1 calf']),
        createValueField('sex', 'female'),
        createValueField('lifeStage', 'adult'),
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments'])
      ]
    },
    {
      name: 'occurrence',
      condition:[{ if: getValueByName('Observations', 'Cow W/2 calves')}],
      add: [
        {
          name: 'occurrence',
          fields: [
            {
              columnName: 'eventID',
              columnValue: [
                {
                  paths: [getValueByName('Effort & Site Conditions', '_key')]
                }
              ]
            },
            {
              columnName: 'occurrenceID',
              columnValue: [
                {
                  paths: [getValueByName('Observations', '_key')],
                  postfix: '16:1'
                }
              ]
            },
            createValueField('individualCount', '1'),
            createValueField('sex', 'unknown'),
            createValueField('lifeStage', 'juvenile'),
            createPathField('occurrenceRemarks', 'Observations', ['Observation Comments'])
          ]
        },
        {
          name: 'occurrence',
          fields: [
            {
              columnName: 'eventID',
              columnValue: [
                {
                  paths: [getValueByName('Effort & Site Conditions', '_key')]
                }
              ]
            },
            {
              columnName: 'occurrenceID',
              columnValue: [
                {
                  paths: [getValueByName('Observations', '_key')],
                  postfix: '16:2'
                }
              ]
            },
            createValueField('individualCount', '1'),
            createValueField('sex', 'unknown'),
            createValueField('lifeStage', 'juvenile'),
            createPathField('occurrenceRemarks', 'Observations', ['Observation Comments'])
          ]
        }
      ],
      fields: [
        {
          columnName: 'eventID',
          columnValue: [
            {
              paths: [getValueByName('Effort & Site Conditions', '_key')]
            }
          ]
        },
        {
          columnName: 'occurrenceID',
          columnValue: [
            {
              paths: [getValueByName('Observations', '_key')],
              postfix: '16'
            }
          ]
        },
        createPathField('individualCount', 'Observations', ['Cow W/2 calves']),
        createValueField('sex', 'female'),
        createValueField('lifeStage', 'adult'),
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments'])
      ]
    },
    {
      name: 'occurrence',
      condition:[{ if: getValueByName('Observations', 'Adult Unclassified Sex')}],
      fields: [
        {
          columnName: 'eventID',
          columnValue: [
            {
              paths: [getValueByName('Effort & Site Conditions', '_key')]
            }
          ]
        },
        {
          columnName: 'occurrenceID',
          columnValue: [
            {
              paths: [getValueByName('Observations', '_key')],
              postfix: '17'
            }
          ]
        },
        createPathField('individualCount', 'Observations', ['Adult Unclassified Sex']),
        createValueField('sex', 'unknown'),
        createValueField('lifeStage', 'adult'),
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments'])
      ]
    },
    {
      name: 'occurrence',
      condition:[{ if: getValueByName('Observations', 'Unclassified Age/Sex')}],
      fields: [
        {
          columnName: 'eventID',
          columnValue: [
            {
              paths: [getValueByName('Effort & Site Conditions', '_key')]
            }
          ]
        },
        {
          columnName: 'occurrenceID',
          columnValue: [
            {
              paths: [getValueByName('Observations', '_key')],
              postfix: '18'
            }
          ]
        },
        createPathField('individualCount', 'Observations', ['Unclassified Age/Sex']),
        createValueField('sex', 'unknown'),
        createValueField('lifeStage', 'unknown'),
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments'])
      ]
    },
    {
      name: 'occurrence',
      condition:[{ if: getValueByName('Observations', 'Spike/Fork Bulls')}],
      fields: [
        {
          columnName: 'eventID',
          columnValue: [
            {
              paths: [getValueByName('Effort & Site Conditions', '_key')]
            }
          ]
        },
        {
          columnName: 'occurrenceID',
          columnValue: [
            {
              paths: [getValueByName('Observations', '_key')],
              postfix: '19'
            }
          ]
        },
        createPathField('individualCount', 'Observations', ['Spike/Fork Bulls']),
        createValueField('sex', 'male'),
        createValueField('lifeStage', 'adult'),
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments'])
      ]
    },
    {
      name: 'occurrence',
      condition:[{ if: getValueByName('Observations', '3 Brow/10 Points Bulls')}],
      fields: [
        {
          columnName: 'eventID',
          columnValue: [
            {
              paths: [getValueByName('Effort & Site Conditions', '_key')]
            }
          ]
        },
        {
          columnName: 'occurrenceID',
          columnValue: [
            {
              paths: [getValueByName('Observations', '_key')],
              postfix: '20'
            }
          ]
        },
        createPathField('individualCount', 'Observations', ['3 Brow/10 Points Bulls']),
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
        createValueField('measurementType', 'Veg Cover (%)'),
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
        createValueField('measurementType', 'Snow Cover (%)'),
        createPathField('measurementValue', 'Observations', ['Snow Cover (%)']),
        createValueField('measurementUnit', '%')
      ]
    },
  ],
  meta: [
    {
      name: 'event',
      key: ['eventID']
    },
    {
      name: 'occurrence',
      key: ['occurrenceID']
    },
    {
      name: 'location',
      key: ['occurrenceID']
    },
    {
      name: 'measurementOrFact',
      key: ['eventID', 'occurrenceID']
    }
  ]
};