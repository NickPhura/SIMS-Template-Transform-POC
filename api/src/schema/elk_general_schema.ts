import { createPathField, createValueField, getValuesByName } from "../xlsx-transform-json-path-queries";
import { TransformSchema } from "../xlsx-transform-schema-parser";

export const elkGeneralSchema: TransformSchema = {
  templateMeta: [
    {
      sheetName: 'Observations',
      primaryKey: ['Study Area', 'Block ID/SU ID'],
      parentKey: [],
      type: 'root',

      foreignKeys: [
        {
          sheetName: 'Marked Animals',
          primaryKey: ['Group Label']
        }
      ]
    },
    {
      sheetName: 'Marked Animals',
      primaryKey: ['Wildlife Health ID', 'Animal ID', 'Telemetry Device ID'],
      parentKey: ['Group Label'],
      type: '',
      foreignKeys: []
    }
  ],
  dwcMeta: [
    {
      sheetName: 'record',
      primaryKey: ['eventID']
    },
    {
      sheetName: 'event',
      primaryKey: ['eventID']
    },
    {
      sheetName: 'location',
      primaryKey: ['eventID']
    },
    {
      sheetName: 'occurrence',
      primaryKey: ['occurrenceID']
    },
    {
      sheetName: 'organism',
      primaryKey: ['organismID']
    },
    {
      sheetName: 'measurementOrFact',
      primaryKey: ['eventID', 'measurementID', 'occurrenceID', 'organismID']
    }
  ],
  map: [
    {
      sheetName: 'record',
      fields: [
        {
          columnName: 'eventId',
          columnValue: [
            {
              paths: [getValuesByName('Observations', ['_key']), getValuesByName('Observations', ['_row'])]
            }
          ]
        },
        {
          columnName: 'basisOfRecord ',
          columnValue: [
            {
              static: 'HumanObservation'
            }
          ]
        }
      ]
    },
    {
      sheetName: 'event',
      fields: [
        {
          columnName: 'eventID',
          columnValue: [
            {
              paths: [getValuesByName('Observations', ['_key']), getValuesByName('Observations', ['_row'])]
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
              paths: [getValuesByName('Observations', ['Observation Comments'])]
            }
          ]
        }
      ] 
    },
    {
      sheetName: 'location',
      condition: { type: 'and', checks: [{ ifNotEmpty: getValuesByName('Observations', ['_key']) }] },
      fields: [
        {
          columnName: 'eventID',
          columnValue: [
            {
              paths: [getValuesByName('Observations', ['_key']), getValuesByName('Observations', ['_row'])]
            }
          ]
        },
        {
          columnName: 'verbatimCoordinates',
          columnValue: [
            {
              paths: [getValuesByName('Observations', ['UTM Zone', 'Easting', 'Northing'])],
              join: ' '
            },
            {
              paths: [getValuesByName('Observations', ['Lat (DD)', 'Long (DD)'])],
              join: ' '
            }
          ]
        },
        {
          columnName: 'decimalLatitude',
          columnValue: [
            {
              paths: [getValuesByName('Observations', ['Lat (DD)'])]
            }
          ]
        },
        {
          columnName: 'decimalLongitude',
          columnValue: [
            {
              paths: [getValuesByName('Observations', ['Long (DD)'])]
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
  // BC RISC Yearling Bulls (static: 0)
  // life stage:Yearling
  // sex: Male
  {
    sheetName: 'occurrence',
    condition: { type: 'and', checks: [{ ifNotEmpty: getValuesByName('Observations', ['BC RISC Yearling Bulls']) }] },
    fields: [
      {
        columnName: 'eventID',
        columnValue: [
          {
            paths: [getValuesByName('Observations', ['_key']), getValuesByName('Observations', ['_row'])]
          }
        ]
      },
      {
        columnName: 'occurrenceID',
        columnValue: [
          {
            paths: [getValuesByName('Observations', ['_key']), getValuesByName('Observations', ['_row'])],
            postfix: {
              static: '0'
            }
          }
        ]
      },
      createPathField('individualCount', 'Observations', ['BC RISC Yearling Bulls']),
      createValueField('sex', 'male'),
      createValueField('lifeStage', 'yearling'),
      createPathField('taxonID', 'Observations', ['Species']),
      createPathField('occurrenceRemarks', 'Observations', ['Observation Comments'])
    ]
  },
  // BC RISC Class I Bulls (static: 1)
  // life stage: Unknown
  // sex: Male
  {
    sheetName: 'occurrence',
    condition: { type: 'and', checks: [{ ifNotEmpty: getValuesByName('Observations', ['BC RISC Class I Bulls']) }] },
    fields: [
      {
        columnName: 'eventID',
        columnValue: [
          {
            paths: [getValuesByName('Observations', ['_key']), getValuesByName('Observations', ['_row'])]
          }
        ]
      },
      {
        columnName: 'occurrenceID',
        columnValue: [
          {
            paths: [getValuesByName('Observations', ['_key']), getValuesByName('Observations', ['_row'])],
            postfix: {
              static: '1'
            }
          }
        ]
      },
      createPathField('individualCount', 'Observations', ['BC RISC Class I Bulls']),
      createValueField('sex', 'male'),
      createValueField('lifeStage', 'unknown'),
      createPathField('taxonID', 'Observations', ['Species']),
      createPathField('occurrenceRemarks', 'Observations', ['Observation Comments'])
    ]
  },
  // BC RISC Class II Bulls (static: 2)
  // life stage: Unknown
  // sex: Male
  {
    sheetName: 'occurrence',
    condition: { type: 'and', checks: [{ ifNotEmpty: getValuesByName('Observations', ['BC RISC Class I Bulls']) }] },
    fields: [
      {
        columnName: 'eventID',
        columnValue: [
          {
            paths: [getValuesByName('Observations', ['_key']), getValuesByName('Observations', ['_row'])]
          }
        ]
      },
      {
        columnName: 'occurrenceID',
        columnValue: [
          {
            paths: [getValuesByName('Observations', ['_key']), getValuesByName('Observations', ['_row'])],
            postfix: {
              static: '2'
            }
          }
        ]
      },
      createPathField('individualCount', 'Observations', ['BC RISC Class II Bulls']),
      createValueField('sex', 'male'),
      createValueField('lifeStage', 'unknown'),
      createPathField('taxonID', 'Observations', ['Species']),
      createPathField('occurrenceRemarks', 'Observations', ['Observation Comments'])
    ]
  },
  // BC RISC Class III Bulls (static: 3)
  // life stage: Adult
  // sex: Male
  {
    sheetName: 'occurrence',
    condition: { type: 'and', checks: [{ ifNotEmpty: getValuesByName('Observations', ['BC RISC Class III Bulls']) }] },
    fields: [
      {
        columnName: 'eventID',
        columnValue: [
          {
            paths: [getValuesByName('Observations', ['_key']), getValuesByName('Observations', ['_row'])]
          }
        ]
      },
      {
        columnName: 'occurrenceID',
        columnValue: [
          {
            paths: [getValuesByName('Observations', ['_key']), getValuesByName('Observations', ['_row'])],
            postfix: {
              static: '3'
            }
          }
        ]
      },
      createPathField('individualCount', 'Observations', ['BC RISC Class III Bulls']),
      createValueField('sex', 'male'),
      createValueField('lifeStage', 'adult'),
      createPathField('taxonID', 'Observations', ['Species']),
      createPathField('occurrenceRemarks', 'Observations', ['Observation Comments'])
    ]
  },
  // BC RISC Class IV Bulls (static: 4)
  // life stage: Adult
  // sex: Male
  {
    sheetName: 'occurrence',
    condition: { type: 'and', checks: [{ ifNotEmpty: getValuesByName('Observations', ['BC RISC Class IV Bulls']) }] },
    fields: [
      {
        columnName: 'eventID',
        columnValue: [
          {
            paths: [getValuesByName('Observations', ['_key']), getValuesByName('Observations', ['_row'])]
          }
        ]
      },
      {
        columnName: 'occurrenceID',
        columnValue: [
          {
            paths: [getValuesByName('Observations', ['_key']), getValuesByName('Observations', ['_row'])],
            postfix: {
              static: '4'
            }
          }
        ]
      },
      createPathField('individualCount', 'Observations', ['BC RISC Class IV Bulls']),
      createValueField('sex', 'male'),
      createValueField('lifeStage', 'adult'),
      createPathField('taxonID', 'Observations', ['Species']),
      createPathField('occurrenceRemarks', 'Observations', ['Observation Comments'])
    ]
  },
  // Spike Bulls (static: 5)
  // life stage: Unknown
  // sex: Male
  {
    sheetName: 'occurrence',
    condition: { type: 'and', checks: [{ ifNotEmpty: getValuesByName('Observations', ['Spike Bulls']) }] },
    fields: [
      {
        columnName: 'eventID',
        columnValue: [
          {
            paths: [getValuesByName('Observations', ['_key']), getValuesByName('Observations', ['_row'])]
          }
        ]
      },
      {
        columnName: 'occurrenceID',
        columnValue: [
          {
            paths: [getValuesByName('Observations', ['_key']), getValuesByName('Observations', ['_row'])],
            postfix: {
              static: '5'
            }
          }
        ]
      },
      createPathField('individualCount', 'Observations', ['Spike Bulls']),
      createValueField('sex', 'male'),
      createValueField('lifeStage', 'unknown'),
      createPathField('taxonID', 'Observations', ['Species']),
      createPathField('occurrenceRemarks', 'Observations', ['Observation Comments'])
    ]
  },
  // Raghorn Bulls (static: 6)
  // life stage: Unknown
  // sex: Male
  {
    sheetName: 'occurrence',
    condition: { type: 'and', checks: [{ ifNotEmpty: getValuesByName('Observations', ['Raghorn Bulls']) }] },
    fields: [
      {
        columnName: 'eventID',
        columnValue: [
          {
            paths: [getValuesByName('Observations', ['_key']), getValuesByName('Observations', ['_row'])]
          }
        ]
      },
      {
        columnName: 'occurrenceID',
        columnValue: [
          {
            paths: [getValuesByName('Observations', ['_key']), getValuesByName('Observations', ['_row'])],
            postfix: {
              static: '6'
            }
          }
        ]
      },
      createPathField('individualCount', 'Observations', ['Raghorn Bulls']),
      createValueField('sex', 'male'),
      createValueField('lifeStage', 'unknown'),
      createPathField('taxonID', 'Observations', ['Species']),
      createPathField('occurrenceRemarks', 'Observations', ['Observation Comments'])
    ]
  },
  // <=3 Point Bulls (static: 7)
  // life stage: Unknown
  // sex: Male
  {
    sheetName: 'occurrence',
    condition: { type: 'and', checks: [{ ifNotEmpty: getValuesByName('Observations', ['<=3 Point Bulls']) }] },
    fields: [
      {
        columnName: 'eventID',
        columnValue: [
          {
            paths: [getValuesByName('Observations', ['_key']), getValuesByName('Observations', ['_row'])]
          }
        ]
      },
      {
        columnName: 'occurrenceID',
        columnValue: [
          {
            paths: [getValuesByName('Observations', ['_key']), getValuesByName('Observations', ['_row'])],
            postfix: {
              static: '7'
            }
          }
        ]
      },
      createPathField('individualCount', 'Observations', ['<=3 Point Bulls']),
      createValueField('sex', 'male'),
      createValueField('lifeStage', 'unknown'),
      createPathField('taxonID', 'Observations', ['Species']),
      createPathField('occurrenceRemarks', 'Observations', ['Observation Comments'])
    ]
  },
  // 3 - 4 Point Bulls (static: 8)
  // life stage: Unknown
  // sex: Male
  {
    sheetName: 'occurrence',
    condition: { type: 'and', checks: [{ ifNotEmpty: getValuesByName('Observations', ['3 - 4 Point Bulls']) }] },
    fields: [
      {
        columnName: 'eventID',
        columnValue: [
          {
            paths: [getValuesByName('Observations', ['_key']), getValuesByName('Observations', ['_row'])]
          }
        ]
      },
      {
        columnName: 'occurrenceID',
        columnValue: [
          {
            paths: [getValuesByName('Observations', ['_key']), getValuesByName('Observations', ['_row'])],
            postfix: {
              static: '8'
            }
          }
        ]
      },
      createPathField('individualCount', 'Observations', ['3 - 4 Point Bulls']),
      createValueField('sex', 'male'),
      createValueField('lifeStage', 'unknown'),
      createPathField('taxonID', 'Observations', ['Species']),
      createPathField('occurrenceRemarks', 'Observations', ['Observation Comments'])
    ]
  },
  // 3 - 5 Point Bulls (static: 9)
  // life stage: Unknown
  // sex: Male
  {
    sheetName: 'occurrence',
    condition: { type: 'and', checks: [{ ifNotEmpty: getValuesByName('Observations', ['3 - 5 Point Bulls']) }] },
    fields: [
      {
        columnName: 'eventID',
        columnValue: [
          {
            paths: [getValuesByName('Observations', ['_key']), getValuesByName('Observations', ['_row'])]
          }
        ]
      },
      {
        columnName: 'occurrenceID',
        columnValue: [
          {
            paths: [getValuesByName('Observations', ['_key']), getValuesByName('Observations', ['_row'])],
            postfix: {
              static: '9'
            }
          }
        ]
      },
      createPathField('individualCount', 'Observations', ['3 - 5 Point Bulls']),
      createValueField('sex', 'male'),
      createValueField('lifeStage', 'unknown'),
      createPathField('taxonID', 'Observations', ['Species']),
      createPathField('occurrenceRemarks', 'Observations', ['Observation Comments'])
    ]
  },
  // <4 Point Bulls (static: 10)
  // life stage: Unknown
  // sex: Male
  {
    sheetName: 'occurrence',
    condition: { type: 'and', checks: [{ ifNotEmpty: getValuesByName('Observations', ['<4 Point Bulls']) }] },
    fields: [
      {
        columnName: 'eventID',
        columnValue: [
          {
            paths: [getValuesByName('Observations', ['_key']), getValuesByName('Observations', ['_row'])]
          }
        ]
      },
      {
        columnName: 'occurrenceID',
        columnValue: [
          {
            paths: [getValuesByName('Observations', ['_key']), getValuesByName('Observations', ['_row'])],
            postfix: {
              static: '10'
            }
          }
        ]
      },
      createPathField('individualCount', 'Observations', ['<4 Point Bulls']),
      createValueField('sex', 'male'),
      createValueField('lifeStage', 'unknown'),
      createPathField('taxonID', 'Observations', ['Species']),
      createPathField('occurrenceRemarks', 'Observations', ['Observation Comments'])
    ]
  },
  // >=4 Point Bulls (static: 11)
  // life stage: Unknown
  // sex: Male
  {
    sheetName: 'occurrence',
    condition: { type: 'and', checks: [{ ifNotEmpty: getValuesByName('Observations', ['>=4 Point Bulls']) }] },
    fields: [
      {
        columnName: 'eventID',
        columnValue: [
          {
            paths: [getValuesByName('Observations', ['_key']), getValuesByName('Observations', ['_row'])]
          }
        ]
      },
      {
        columnName: 'occurrenceID',
        columnValue: [
          {
            paths: [getValuesByName('Observations', ['_key']), getValuesByName('Observations', ['_row'])],
            postfix: {
              static: '11'
            }
          }
        ]
      },
      createPathField('individualCount', 'Observations', ['>=4 Point Bulls']),
      createValueField('sex', 'male'),
      createValueField('lifeStage', 'unknown'),
      createPathField('taxonID', 'Observations', ['Species']),
      createPathField('occurrenceRemarks', 'Observations', ['Observation Comments'])
    ]
  },
  // 5 Point Bulls (static: 12)
  // life stage: Adult
  // sex: Male
  {
    sheetName: 'occurrence',
    condition: { type: 'and', checks: [{ ifNotEmpty: getValuesByName('Observations', ['5 Point Bulls']) }] },
    fields: [
      {
        columnName: 'eventID',
        columnValue: [
          {
            paths: [getValuesByName('Observations', ['_key']), getValuesByName('Observations', ['_row'])]
          }
        ]
      },
      {
        columnName: 'occurrenceID',
        columnValue: [
          {
            paths: [getValuesByName('Observations', ['_key']), getValuesByName('Observations', ['_row'])],
            postfix: {
              static: '12'
            }
          }
        ]
      },
      createPathField('individualCount', 'Observations', ['5 Point Bulls']),
      createValueField('sex', 'male'),
      createValueField('lifeStage', 'adult'),
      createPathField('taxonID', 'Observations', ['Species']),
      createPathField('occurrenceRemarks', 'Observations', ['Observation Comments'])
    ]
  },
  // >=5 Point Bulls (static: 13)
  // life stage: Adult
  // sex: Male
  {
    sheetName: 'occurrence',
    condition: { type: 'and', checks: [{ ifNotEmpty: getValuesByName('Observations', ['>=5 Point Bulls']) }] },
    fields: [
      {
        columnName: 'eventID',
        columnValue: [
          {
            paths: [getValuesByName('Observations', ['_key']), getValuesByName('Observations', ['_row'])]
          }
        ]
      },
      {
        columnName: 'occurrenceID',
        columnValue: [
          {
            paths: [getValuesByName('Observations', ['_key']), getValuesByName('Observations', ['_row'])],
            postfix: {
              static: '13'
            }
          }
        ]
      },
      createPathField('individualCount', 'Observations', ['>=5 Point Bulls']),
      createValueField('sex', 'male'),
      createValueField('lifeStage', 'adult'),
      createPathField('taxonID', 'Observations', ['Species']),
      createPathField('occurrenceRemarks', 'Observations', ['Observation Comments'])
    ]
  },
  // >= 6 Point Bulls (static: 14)
  // life stage: Adult
  // sex: Male
  {
    sheetName: 'occurrence',
    condition: { type: 'and', checks: [{ ifNotEmpty: getValuesByName('Observations', ['>= 6 Point Bulls']) }] },
    fields: [
      {
        columnName: 'eventID',
        columnValue: [
          {
            paths: [getValuesByName('Observations', ['_key']), getValuesByName('Observations', ['_row'])]
          }
        ]
      },
      {
        columnName: 'occurrenceID',
        columnValue: [
          {
            paths: [getValuesByName('Observations', ['_key']), getValuesByName('Observations', ['_row'])],
            postfix: {
              static: '14'
            }
          }
        ]
      },
      createPathField('individualCount', 'Observations', ['>=6 Point Bulls']),
      createValueField('sex', 'male'),
      createValueField('lifeStage', 'adult'),
      createPathField('taxonID', 'Observations', ['Species']),
      createPathField('occurrenceRemarks', 'Observations', ['Observation Comments'])
    ]
  },
  // Adult Bulls - Unclassified (static: 15)
  // life stage: Adult
  // sex: Male
  {
    sheetName: 'occurrence',
    condition: { type: 'and', checks: [{ ifNotEmpty: getValuesByName('Observations', ['Adult Bulls - Unclassified']) }] },
    fields: [
      {
        columnName: 'eventID',
        columnValue: [
          {
            paths: [getValuesByName('Observations', ['_key']), getValuesByName('Observations', ['_row'])]
          }
        ]
      },
      {
        columnName: 'occurrenceID',
        columnValue: [
          {
            paths: [getValuesByName('Observations', ['_key']), getValuesByName('Observations', ['_row'])],
            postfix: {
              static: '15'
            }
          }
        ]
      },
      createPathField('individualCount', 'Observations', ['Adult Bulls - Unclassified']),
      createValueField('sex', 'male'),
      createValueField('lifeStage', 'adult'),
      createPathField('taxonID', 'Observations', ['Species']),
      createPathField('occurrenceRemarks', 'Observations', ['Observation Comments'])
    ]
  },
  // Unclassified Bulls (static: 16)
  // life stage: Unknown
  // sex: Male
  {
    sheetName: 'occurrence',
    condition: { type: 'and', checks: [{ ifNotEmpty: getValuesByName('Observations', ['Unclassified Bulls']) }] },
    fields: [
      {
        columnName: 'eventID',
        columnValue: [
          {
            paths: [getValuesByName('Observations', ['_key']), getValuesByName('Observations', ['_row'])]
          }
        ]
      },
      {
        columnName: 'occurrenceID',
        columnValue: [
          {
            paths: [getValuesByName('Observations', ['_key']), getValuesByName('Observations', ['_row'])],
            postfix: {
              static: '16'
            }
          }
        ]
      },
      createPathField('individualCount', 'Observations', ['Unclassified Bulls']),
      createValueField('sex', 'male'),
      createValueField('lifeStage', 'adult'),
      createPathField('taxonID', 'Observations', ['Species']),
      createPathField('occurrenceRemarks', 'Observations', ['Observation Comments'])
    ]
  },
  // Cows (static: 17)
  // life stage: Adult
  // sex: Female
  {
    sheetName: 'occurrence',
    condition: { type: 'and', checks: [{ ifNotEmpty: getValuesByName('Observations', ['Cows']) }] },
    fields: [
      {
        columnName: 'eventID',
        columnValue: [
          {
            paths: [getValuesByName('Observations', ['_key']), getValuesByName('Observations', ['_row'])]
          }
        ]
      },
      {
        columnName: 'occurrenceID',
        columnValue: [
          {
            paths: [getValuesByName('Observations', ['_key']), getValuesByName('Observations', ['_row'])],
            postfix: {
              static: '17'
            }
          }
        ]
      },
      createPathField('individualCount', 'Observations', ['Cows']),
      createValueField('sex', 'female'),
      createValueField('lifeStage', 'adult'),
      createPathField('taxonID', 'Observations', ['Species']),
      createPathField('occurrenceRemarks', 'Observations', ['Observation Comments'])
    ]
  },
  // Calves (static: 18)
  // life stage: Juvenile
  // sex: Unknown
  {
    sheetName: 'occurrence',
    condition: { type: 'and', checks: [{ ifNotEmpty: getValuesByName('Observations', ['Calves']) }] },
    fields: [
      {
        columnName: 'eventID',
        columnValue: [
          {
            paths: [getValuesByName('Observations', ['_key']), getValuesByName('Observations', ['_row'])]
          }
        ]
      },
      {
        columnName: 'occurrenceID',
        columnValue: [
          {
            paths: [getValuesByName('Observations', ['_key']), getValuesByName('Observations', ['_row'])],
            postfix: {
              static: '18'
            }
          }
        ]
      },
      createPathField('individualCount', 'Observations', ['Calves']),
      createValueField('sex', 'unknown'),
      createValueField('lifeStage', 'juvenile'),
      createPathField('taxonID', 'Observations', ['Species']),
      createPathField('occurrenceRemarks', 'Observations', ['Observation Comments'])
    ]
  },
  // Adult Unclassified Sex (static: 19)
  // life stage: Adult
  // sex: Unknown
  {
    sheetName: 'occurrence',
    condition: { type: 'and', checks: [{ ifNotEmpty: getValuesByName('Observations', ['Adult Unclassified Sex']) }] },
    fields: [
      {
        columnName: 'eventID',
        columnValue: [
          {
            paths: [getValuesByName('Observations', ['_key']), getValuesByName('Observations', ['_row'])]
          }
        ]
      },
      {
        columnName: 'occurrenceID',
        columnValue: [
          {
            paths: [getValuesByName('Observations', ['_key']), getValuesByName('Observations', ['_row'])],
            postfix: {
              static: '19'
            }
          }
        ]
      },
      createPathField('individualCount', 'Observations', ['Adult Unclassified Sex']),
      createValueField('sex', 'unknown'),
      createValueField('lifeStage', 'adult'),
      createPathField('taxonID', 'Observations', ['Species']),
      createPathField('occurrenceRemarks', 'Observations', ['Observation Comments'])
    ]
  },
  // Yearling - Unclassified Sex (static: 20)
  // life stage: Yearling
  // sex: Unknown
  {
    sheetName: 'occurrence',
    condition: { type: 'and', checks: [{ ifNotEmpty: getValuesByName('Observations', ['Yearling - Unclassified Sex']) }] },
    fields: [
      {
        columnName: 'eventID',
        columnValue: [
          {
            paths: [getValuesByName('Observations', ['_key']), getValuesByName('Observations', ['_row'])]
          }
        ]
      },
      {
        columnName: 'occurrenceID',
        columnValue: [
          {
            paths: [getValuesByName('Observations', ['_key']), getValuesByName('Observations', ['_row'])],
            postfix: {
              static: '20'
            }
          }
        ]
      },
      createPathField('individualCount', 'Observations', ['Yearling - Unclassified Sex']),
      createValueField('sex', 'unknown'),
      createValueField('lifeStage', 'yearling'),
      createPathField('taxonID', 'Observations', ['Species']),
      createPathField('occurrenceRemarks', 'Observations', ['Observation Comments'])
    ]
  },
  // Unclassified Age/Sex (static: 21)
  // life stage: Unknown
  // sex: Unknown
  {
    sheetName: 'occurrence',
    condition: { type: 'and', checks: [{ ifNotEmpty: getValuesByName('Observations', ['Unclassified Age/Sex']) }] },
    fields: [
      {
        columnName: 'eventID',
        columnValue: [
          {
            paths: [getValuesByName('Observations', ['_key']), getValuesByName('Observations', ['_row'])]
          }
        ]
      },
      {
        columnName: 'occurrenceID',
        columnValue: [
          {
            paths: [getValuesByName('Observations', ['_key']), getValuesByName('Observations', ['_row'])],
            postfix: {
              static: '21'
            }
          }
        ]
      },
      createPathField('individualCount', 'Observations', ['Unclassified Age/Sex']),
      createValueField('sex', 'unknown'),
      createValueField('lifeStage', 'unknown'),
      createPathField('taxonID', 'Observations', ['Species']),
      createPathField('occurrenceRemarks', 'Observations', ['Observation Comments'])
    ]
  },
  ]
}