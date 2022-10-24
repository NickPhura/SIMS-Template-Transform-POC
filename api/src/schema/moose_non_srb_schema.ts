import { createPathField, createValueField, getMultipleValuesByName, getValueByName } from '../json-path-queries';
import { TransformSchema } from '../schema-utils';


// is the non srb missing something? how are we supposed to uniquely identify events/ occurrences
// what are the differences between unclassified and unclassified age/sex?
// what else in these templates do we need to transform?
// date mis matched in file, going to cause problems finding data for later
// need a mechanism to switch between ids

// REQUIRED VALIDATION
// dates need to be the same
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
        createValueField('type', 'Human Observed'),
        createValueField('basisOfRecord', 'Occurrence')
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
              paths: [getValueByName('Observations', '_key')],
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
        createPathField('verbatimSRS', 'Observations', ['Datum']),
        createPathField('locationRemarks', 'Effort & Site Conditions', ['Effort & Site Comments'])
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
        createPathField('individualCount', 'Observations', ['Yearling Bulls']),
        createValueField('sex', 'male'),
        createValueField('lifeStage', 'juvenile'),
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments']),
        createPathField('behavior', 'Observations', ['Activity'])
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
              postfix: '2'
            }
          ]
        },
        createPathField('individualCount', 'Observations', ['Adult Bulls - Unclassified']),
        createValueField('sex', 'male'),
        createValueField('lifeStage', 'adult'),
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments']),
        createPathField('behavior', 'Observations', ['Activity'])
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
              postfix: '3'
            }
          ]
        },
        createPathField('individualCount', 'Observations', ['Sub-Prime Bulls']),
        createValueField('sex', 'male'),
        createValueField('lifeStage', 'adult'),
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments']),
        createPathField('behavior', 'Observations', ['Activity'])
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
              postfix: '4'
            }
          ]
        },
        createPathField('individualCount', 'Observations', ['Prime Bulls']),
        createValueField('sex', 'male'),
        createValueField('lifeStage', 'adult'),
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments']),
        createPathField('behavior', 'Observations', ['Activity'])
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
              postfix: '5'
            }
          ]
        },
        createPathField('individualCount', 'Observations', ['Senior Bulls']),
        createValueField('sex', 'male'),
        createValueField('lifeStage', 'adult'),
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments']),
        createPathField('behavior', 'Observations', ['Activity'])
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
              postfix: '6'
            }
          ]
        },
        createPathField('individualCount', 'Observations', ['RISC Class I Bulls']),
        createValueField('sex', 'male'),
        createValueField('lifeStage', 'adult'),
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments']),
        createPathField('behavior', 'Observations', ['Activity'])
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
              postfix: '7'
            }
          ]
        },
        createPathField('individualCount', 'Observations', ['RISC Class II Bulls']),
        createValueField('sex', 'male'),
        createValueField('lifeStage', 'adult'),
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments']),
        createPathField('behavior', 'Observations', ['Activity'])
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
              postfix: '8'
            }
          ]
        },
        createPathField('individualCount', 'Observations', ['RISC Class III Bulls']),
        createValueField('sex', 'male'),
        createValueField('lifeStage', 'adult'),
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments']),
        createPathField('behavior', 'Observations', ['Activity'])
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
              postfix: '9'
            }
          ]
        },
        createPathField('individualCount', 'Observations', ['Oswald (1997) Class I Bulls']),
        createValueField('sex', 'male'),
        createValueField('lifeStage', 'adult'),
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments']),
        createPathField('behavior', 'Observations', ['Activity'])
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
              postfix: '10'
            }
          ]
        },
        createPathField('individualCount', 'Observations', ['Oswald (1997) Class II Bulls']),
        createValueField('sex', 'male'),
        createValueField('lifeStage', 'adult'),
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments']),
        createPathField('behavior', 'Observations', ['Activity'])
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
              postfix: '11'
            }
          ]
        },
        createPathField('individualCount', 'Observations', ['Oswald (1997) Class III Bulls']),
        createValueField('sex', 'male'),
        createValueField('lifeStage', 'adult'),
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments']),
        createPathField('behavior', 'Observations', ['Activity'])
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
        createValueField('lifeStage', 'adult'),
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments']),
        createPathField('behavior', 'Observations', ['Activity'])
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
        createValueField('sex', 'male'),
        createValueField('lifeStage', 'adult'),
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments']),
        createPathField('behavior', 'Observations', ['Activity'])
      ]
    },
    {
      name: 'occurrence',
      condition:[{ if: getValueByName('Observations', 'Lone Calf')}],
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
        createPathField('individualCount', 'Observations', ['Lone Calf']),
        createValueField('sex', 'male'),
        createValueField('lifeStage', 'adult'),
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments']),
        createPathField('behavior', 'Observations', ['Activity'])
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
            createPathField('occurrenceRemarks', 'Observations', ['Observation Comments']),
        createPathField('behavior', 'Observations', ['Activity'])
          ]
        },
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
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments']),
        createPathField('behavior', 'Observations', ['Activity'])
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
            createPathField('occurrenceRemarks', 'Observations', ['Observation Comments']),
            createPathField('behavior', 'Observations', ['Activity'])
          ]
        },
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
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments']),
        createPathField('behavior', 'Observations', ['Activity'])
      ]
    },
    {
      name: 'occurrence',
      condition:[{ if: getValueByName('Observations', 'Unclassified')}],
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
        createPathField('individualCount', 'Observations', ['Unclassified']),
        createValueField('sex', 'unknown'),
        createValueField('lifeStage', 'unknown'),
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments']),
        createPathField('behavior', 'Observations', ['Activity'])
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
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments']),
        createPathField('behavior', 'Observations', ['Activity'])
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
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments']),
        createPathField('behavior', 'Observations', ['Activity'])
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
              postfix: '19'
            }
          ]
        },
        createPathField('individualCount', 'Observations', ['3 Brow/10 Points Bulls']),
        createValueField('sex', 'male'),
        createValueField('lifeStage', 'adult'),
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments']),
        createPathField('behavior', 'Observations', ['Activity'])
      ]
    },
    {
      name: 'occurrence',
      condition:[{ if: getValueByName('Incidental Observations', 'Adult Males')}],
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
              paths: [getValueByName('Incidental Observations', '_key')],
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
      condition:[{ if: getValueByName('Incidental Observations', 'Adult Females')}],
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
              paths: [getValueByName('Incidental Observations', '_key')],
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
      condition:[{ if: getValueByName('Incidental Observations', 'Adults - Unclassified Sex')}],
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
              paths: [getValueByName('Incidental Observations', '_key')],
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
      condition:[{ if: getValueByName('Incidental Observations', 'Juvenile Males')}],
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
              paths: [getValueByName('Incidental Observations', '_key')],
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
      condition:[{ if: getValueByName('Incidental Observations', 'Juvenile Females')}],
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
              paths: [getValueByName('Incidental Observations', '_key')],
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
      condition:[{ if: getValueByName('Incidental Observations', 'Juveniles - Unclassified Sex')}],
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
              paths: [getValueByName('Incidental Observations', '_key')],
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
      condition:[{ if: getValueByName('Incidental Observations', 'Unknown Age/Sex')}],
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
              paths: [getValueByName('Incidental Observations', '_key')],
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
              paths: [getValueByName('Effort & Site Conditions', '_key')]
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
              paths: [getValueByName('Effort & Site Conditions', '_key')]
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
        createValueField('measurementType', 'Snow Cover (%)'),
        createPathField('measurementValue', 'Observations', ['Snow Cover (%)']),
        createValueField('measurementUnit', '%')
      ]
    },
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
}