import { createPathField, createValueField, getValuesByName } from '../xlsx-transform-json-path-queries';
import { TransformSchema } from '../xlsx-transform-schema-parser';

export const sheepTotalCountchema: TransformSchema = {
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
  map: [
    {
      sheetName: 'record',
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
    {
      sheetName: 'occurrence',
      condition: { type: 'and', checks: [{ ifNotEmpty: getValuesByName('Observations', ['BC RISC Class I Rams']) }] },
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
        createPathField('individualCount', 'Observations', ['BC RISC Class I Rams']),
        createValueField('sex', 'male'),
        createValueField('lifeStage', '2 year old (Peace-Liard)'),
        createPathField('taxonID', 'Observations', ['Species']),
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments'])
      ],
      add: [
        {
          sheetName: 'measurementOrFact',
          fields: [
            {
              columnName: 'eventID',
              columnValue: [
                {
                  paths: [getValuesByName('Observations', ['_key']), getValuesByName('Observations', ['_row'])],
                }
              ]
            },
            {
              columnName: 'measurementID',
              columnValue: [
                {
                  paths: [getValuesByName('Observations', ['_key']), getValuesByName('Observations', ['_row'])],
                  postfix: {
                    static: 'horn-configuration'
                  }
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
            createValueField('measurementType', 'Horn Configuration'),
            createValueField('measurementUnit', ''),
            createValueField('measurementValue', 'BC RISC Class I')
          ]
        }
      ]
    },
    {
      sheetName: 'occurrence',
      condition: { type: 'and', checks: [{ ifNotEmpty: getValuesByName('Observations', ['BC RISC Class II Rams']) }] },
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
        createPathField('individualCount', 'Observations', ['BC RISC Class II Rams']),
        createValueField('sex', 'male'),
        createValueField('lifeStage', '3 year old (Peace-Liard)'),
        createPathField('taxonID', 'Observations', ['Species']),
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments'])
      ],
      add: [
        {
          sheetName: 'measurementOrFact',
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
              columnName: 'measurementID',
              columnValue: [
                {
                  paths: [getValuesByName('Observations', ['_key']), getValuesByName('Observations', ['_row'])],
                  postfix: {
                    static: 'horn-configuration'
                  }
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
            createValueField('measurementType', 'Horn Configuration'),
            createValueField('measurementUnit', ''),
            createValueField('measurementValue', 'BC RISC Class II')
          ]
        }
      ]
    },
    {
      sheetName: 'occurrence',
      condition: { type: 'and', checks: [{ ifNotEmpty: getValuesByName('Observations', ['BC RISC Class III Rams']) }] },
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
        createPathField('individualCount', 'Observations', ['BC RISC Class III Rams']),
        createValueField('sex', 'male'),
        createValueField('lifeStage', '=>4 years old (Peace-Liard)'),
        createPathField('taxonID', 'Observations', ['Species']),
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments'])
      ],
      add: [
        {
          sheetName: 'measurementOrFact',
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
              columnName: 'measurementID',
              columnValue: [
                {
                  paths: [getValuesByName('Observations', ['_key']), getValuesByName('Observations', ['_row'])],
                  postfix: {
                    static: 'horn-configuration'
                  }
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
            createValueField('measurementType', 'Horn Configuration'),
            createValueField('measurementUnit', ''),
            createValueField('measurementValue', 'BC RISC Class III')
          ]
        }
      ]
    },
    {
      sheetName: 'occurrence',
      condition: { type: 'and', checks: [{ ifNotEmpty: getValuesByName('Observations', ['BC RISC Class IV Rams']) }] },
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
        createPathField('individualCount', 'Observations', ['BC RISC Class IV Rams']),
        createValueField('sex', 'male'),
        createValueField('lifeStage', 'adult'),
        createPathField('taxonID', 'Observations', ['Species']),
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments'])
      ],
      add: [
        {
          sheetName: 'measurementOrFact',
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
              columnName: 'measurementID',
              columnValue: [
                {
                  paths: [getValuesByName('Observations', ['_key']), getValuesByName('Observations', ['_row'])],
                  postfix: {
                    static: 'horn-configuration'
                  }
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
            createValueField('measurementType', 'Horn Configuration'),
            createValueField('measurementUnit', ''),
            createValueField('measurementValue', 'BC RISC Class IV')
          ]
        }
      ]
    },
    {
      sheetName: 'occurrence',
      condition: { type: 'and', checks: [{ ifNotEmpty: getValuesByName('Observations', ['Ram - Unclassified']) }] },
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
        createPathField('individualCount', 'Observations', ['Ram - Unclassified']),
        createValueField('sex', 'male'),
        createValueField('lifeStage', 'unknown'),
        createPathField('taxonID', 'Observations', ['Species']),
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments'])
      ]
    },
    {
      sheetName: 'occurrence',
      condition: { type: 'and', checks: [{ ifNotEmpty: getValuesByName('Observations', ['Ewes']) }] },
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
        createPathField('individualCount', 'Observations', ['Ewes']),
        createValueField('sex', 'female'),
        createValueField('lifeStage', 'adult'),
        createPathField('taxonID', 'Observations', ['Species']),
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments'])
      ]
    },
    {
      sheetName: 'occurrence',
      condition: { type: 'and', checks: [{ ifNotEmpty: getValuesByName('Observations', ['Yearlings']) }] },
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
        createPathField('individualCount', 'Observations', ['Yearlings']),
        createValueField('sex', 'unknown'),
        createValueField('lifeStage', 'juvenile'),
        createPathField('taxonID', 'Observations', ['Species']),
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments'])
      ]
    },
    {
      sheetName: 'occurrence',
      condition: { type: 'and', checks: [{ ifNotEmpty: getValuesByName('Observations', ['Lambs']) }] },
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
        createPathField('individualCount', 'Observations', ['Lambs']),
        createValueField('sex', 'unknown'),
        createValueField('lifeStage', 'juvenile'),
        createPathField('taxonID', 'Observations', ['Species']),
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments'])
      ]
    },
    {
      sheetName: 'occurrence',
      condition: {
        type: 'and',
        checks: [{ ifNotEmpty: getValuesByName('Observations', ['Ewe-Like Sheep']) }]
      },
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
        createPathField('individualCount', 'Observations', ['Ewe-Like Sheep']),
        createValueField('sex', 'unknown'),
        createValueField('lifeStage', 'ewe-like'),
        createPathField('taxonID', 'Observations', ['Species']),
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments'])
      ]
    },
    {
      sheetName: 'occurrence',
      condition: {
        type: 'and',
        checks: [{ ifNotEmpty: getValuesByName('Observations', ['Adults Unclassified Sex']) }]
      },
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
        createPathField('individualCount', 'Observations', ['Adults Unclassified Sex']),
        createValueField('sex', 'unknown'),
        createValueField('lifeStage', 'adult'),
        createPathField('taxonID', 'Observations', ['Species']),
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments'])
      ]
    },
    {
      sheetName: 'occurrence',
      condition: {
        type: 'and',
        checks: [{ ifNotEmpty: getValuesByName('Observations', ['Unclassified Age/Sex']) }]
      },
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
        createPathField('individualCount', 'Observations', ['Unclassified Age/Sex']),
        createValueField('sex', 'unknown'),
        createValueField('lifeStage', 'unknown'),
        createPathField('taxonID', 'Observations', ['Species']),
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments'])
      ]
    },
    {
      sheetName: 'organism',
      condition: {
        type: 'and',
        checks: [
          { ifNotEmpty: getValuesByName('Marked Animals', ['Wildlife Health ID', 'Animal ID', 'Telemetry Device ID']) }
        ]
      },
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
          columnName: 'organismID',
          columnValue: [
            {
              paths: [getValuesByName('Marked Animals', ['_key']), getValuesByName('Marked Animals', ['_row'])]
            }
          ]
        },
        createPathField('organismRemarks', 'Marked Animals', ['Marked Animals Comments'])
      ]
    },
    {
      sheetName: 'measurementOrFact',
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
          columnName: 'measurementID',
          columnValue: [
            {
              paths: [getValuesByName('Observations', ['_key']), getValuesByName('Observations', ['_row'])],
              postfix: {
                static: 'study-area'
              }
            }
          ]
        },
        createValueField('measurementType', 'Study Area'),
        createValueField('measurementUnit', ''),
        createPathField('measurementValue', 'Observations', ['Study Area'])
      ]
    },
    {
      sheetName: 'measurementOrFact',
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
          columnName: 'measurementID',
          columnValue: [
            {
              paths: [getValuesByName('Observations', ['_key']), getValuesByName('Observations', ['_row'])],
              postfix: {
                static: 'block-id/su-id'
              }
            }
          ]
        },
        createValueField('measurementType', 'Block ID/SU ID'),
        createValueField('measurementUnit', ''),
        createPathField('measurementValue', 'Observations', ['Block ID/SU ID'])
      ]
    },
    {
      sheetName: 'measurementOrFact',
      condition: {
        type: 'and',
        checks: [{ ifNotEmpty: getValuesByName('Observations', ['Group Label']) }]
      },
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
          columnName: 'measurementID',
          columnValue: [
            {
              paths: [getValuesByName('Observations', ['_key']), getValuesByName('Observations', ['_row'])],
              postfix: {
                static: 'group-label'
              }
            }
          ]
        },
        createValueField('measurementType', 'Group Label'),
        createValueField('measurementUnit', ''),
        createPathField('measurementValue', 'Observations', ['Group Label'])
      ]
    },
    {
      sheetName: 'measurementOrFact',
      condition: {
        type: 'or',
        checks: [
          { ifNotEmpty: getValuesByName('Observations', ['Sign Type']) },
          { ifNotEmpty: getValuesByName('Observations', ['Sign Count']) }
        ]
      },
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
          columnName: 'measurementID',
          columnValue: [
            {
              paths: [getValuesByName('Observations', ['_key']), getValuesByName('Observations', ['_row'])],
              postfix: {
                static: 'sign-type'
              }
            }
          ]
        },
        createValueField('measurementType', 'Sign Type'),
        createValueField('measurementUnit', ''),
        createPathField('measurementValue', 'Observations', ['Sign Type'])
      ]
    },
    {
      sheetName: 'measurementOrFact',
      condition: {
        type: 'or',
        checks: [
          { ifNotEmpty: getValuesByName('Observations', ['Sign Count']) },
          { ifNotEmpty: getValuesByName('Observations', ['Sign Type']) }
        ]
      },
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
          columnName: 'measurementID',
          columnValue: [
            {
              paths: [getValuesByName('Observations', ['_key']), getValuesByName('Observations', ['_row'])],
              postfix: {
                static: 'sign-count'
              }
            }
          ]
        },
        createValueField('measurementType', 'Sign Count'),
        createValueField('measurementUnit', ''),
        createPathField('measurementValue', 'Observations', ['Sign Count'])
      ]
    },
    {
      sheetName: 'measurementOrFact',
      condition: {
        type: 'and',
        checks: [{ ifNotEmpty: getValuesByName('Observations', ['Age of Sign']) }]
      },
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
          columnName: 'measurementID',
          columnValue: [
            {
              paths: [getValuesByName('Observations', ['_key']), getValuesByName('Observations', ['_row'])],
              postfix: {
                static: 'age-of-sign'
              }
            }
          ]
        },
        createValueField('measurementType', 'Age of Sign'),
        createValueField('measurementUnit', ''),
        createPathField('measurementValue', 'Observations', ['Age of Sign'])
      ]
    },
    {
      sheetName: 'measurementOrFact',
      condition: {
        type: 'and',
        checks: [{ ifNotEmpty: getValuesByName('Observations', ['Veg Cover (%)']) }]
      },
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
          columnName: 'measurementID',
          columnValue: [
            {
              paths: [getValuesByName('Observations', ['_key']), getValuesByName('Observations', ['_row'])],
              postfix: {
                static: 'veg-cover'
              }
            }
          ]
        },
        createValueField('measurementType', 'Veg Cover'),
        createValueField('measurementUnit', '%'),
        createPathField('measurementValue', 'Observations', ['Veg Cover (%)'])
      ]
    },
    {
      sheetName: 'measurementOrFact',
      condition: {
        type: 'and',
        checks: [{ ifNotEmpty: getValuesByName('Observations', ['Snow Cover (%)']) }]
      },
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
          columnName: 'measurementID',
          columnValue: [
            {
              paths: [getValuesByName('Observations', ['_key']), getValuesByName('Observations', ['_row'])],
              postfix: {
                static: 'snow-cover'
              }
            }
          ]
        },
        createValueField('measurementType', 'Snow Cover'),
        createValueField('measurementUnit', '%'),
        createPathField('measurementValue', 'Observations', ['Snow Cover (%)'])
      ]
    },
    {
      sheetName: 'measurementOrFact',
      condition: {
        type: 'and',
        checks: [{ ifNotEmpty: getValuesByName('Observations', ['Activity']) }]
      },
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
          columnName: 'measurementID',
          columnValue: [
            {
              paths: [getValuesByName('Observations', ['_key']), getValuesByName('Observations', ['_row'])],
              postfix: {
                static: 'activity'
              }
            }
          ]
        },
        createValueField('measurementType', 'Activity'),
        createValueField('measurementUnit', ''),
        createPathField('measurementValue', 'Observations', ['Activity'])
      ]
    },
    {
      sheetName: 'measurementOrFact',
      condition: {
        type: 'and',
        checks: [{ ifNotEmpty: getValuesByName('Observations', ['Elevation (m) of Observation']) }]
      },
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
          columnName: 'measurementID',
          columnValue: [
            {
              paths: [getValuesByName('Observations', ['_key']), getValuesByName('Observations', ['_row'])],
              postfix: {
                static: 'elevation-observation'
              }
            }
          ]
        },
        createValueField('measurementType', 'Elevation (m) of Observation'),
        createValueField('measurementUnit', ''),
        createPathField('measurementValue', 'Observations', ['Elevation (m) of Observation'])
      ]
    },

    {
      sheetName: 'measurementOrFact',
      condition: {
        type: 'and',
        checks: [{ ifNotEmpty: getValuesByName('Observations', ['Habitat']) }]
      },
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
          columnName: 'measurementID',
          columnValue: [
            {
              paths: [getValuesByName('Observations', ['_key']), getValuesByName('Observations', ['_row'])],
              postfix: {
                static: 'habitat'
              }
            }
          ]
        },
        createValueField('measurementType', 'Habitat'),
        createValueField('measurementUnit', ''),
        createPathField('measurementValue', 'Observations', ['Habitat'])
      ]
    },
    {
      sheetName: 'measurementOrFact',
      condition: {
        type: 'and',
        checks: [{ ifNotEmpty: getValuesByName('Observations', ['Habitat-Slope']) }]
      },
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
          columnName: 'measurementID',
          columnValue: [
            {
              paths: [getValuesByName('Observations', ['_key']), getValuesByName('Observations', ['_row'])],
              postfix: {
                static: 'habitat-slope'
              }
            }
          ]
        },
        createValueField('measurementType', 'Habitat-Slope'),
        createValueField('measurementUnit', ''),
        createPathField('measurementValue', 'Observations', ['Habitat-Slope'])
      ]
    },
    {
      sheetName: 'measurementOrFact',
      condition: {
        type: 'and',
        checks: [{ ifNotEmpty: getValuesByName('Observations', ['Terrain Obstruction']) }]
      },
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
          columnName: 'measurementID',
          columnValue: [
            {
              paths: [getValuesByName('Observations', ['_key']), getValuesByName('Observations', ['_row'])],
              postfix: {
                static: 'terrain-obstruction'
              }
            }
          ]
        },
        createValueField('measurementType', 'Terrain Obstruction'),
        createValueField('measurementUnit', ''),
        createPathField('measurementValue', 'Observations', ['Terrain Obstruction'])
      ]
    },
    {
      sheetName: 'measurementOrFact',
      condition: {
        type: 'and',
        checks: [{ ifNotEmpty: getValuesByName('Observations', ['Number of Marked Animals Observed']) }]
      },
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
          columnName: 'measurementID',
          columnValue: [
            {
              paths: [getValuesByName('Observations', ['_key']), getValuesByName('Observations', ['_row'])],
              postfix: {
                static: 'number-of-marked-animals-observed'
              }
            }
          ]
        },
        createValueField('measurementType', 'Number of Marked Animals Observed'),
        createValueField('measurementUnit', ''),
        createPathField('measurementValue', 'Observations', ['Number of Marked Animals Observed'])
      ]
    },
    {
      sheetName: 'measurementOrFact',
      condition: {
        type: 'and',
        checks: [{ ifNotEmpty: getValuesByName('Observations', ['Survey or Telemetry Search']) }]
      },
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
          columnName: 'measurementID',
          columnValue: [
            {
              paths: [getValuesByName('Observations', ['_key']), getValuesByName('Observations', ['_row'])],
              postfix: {
                static: 'survey-or-telemetry-search'
              }
            }
          ]
        },
        createValueField('measurementType', 'Survey or Telemetry Search'),
        createValueField('measurementUnit', ''),
        createPathField('measurementValue', 'Observations', ['Survey or Telemetry Search'])
      ]
    },
    {
      sheetName: 'measurementOrFact',
      condition: {
        type: 'and',
        checks: [{ ifNotEmpty: getValuesByName('Observations', ['Photos']) }]
      },
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
          columnName: 'measurementID',
          columnValue: [
            {
              paths: [getValuesByName('Observations', ['_key']), getValuesByName('Observations', ['_row'])],
              postfix: {
                static: 'photos'
              }
            }
          ]
        },
        createValueField('measurementType', 'Photos'),
        createValueField('measurementUnit', ''),
        createPathField('measurementValue', 'Observations', ['Photos'])
      ]
    },

    //

    {
      sheetName: 'measurementOrFact',
      condition: {
        type: 'and',
        checks: [{ ifNotEmpty: getValuesByName('Marked Animals', ['Wildlife Health ID']) }]
      },
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
          columnName: 'organismID',
          columnValue: [
            {
              paths: [getValuesByName('Marked Animals', ['_key']), getValuesByName('Marked Animals', ['_row'])]
            }
          ]
        },
        {
          columnName: 'measurementID',
          columnValue: [
            {
              paths: [getValuesByName('Marked Animals', ['_key']), getValuesByName('Marked Animals', ['_row'])],
              postfix: {
                static: 'wildlife-health-id'
              }
            }
          ]
        },
        createValueField('measurementType', 'Wildlife Health ID'),
        createValueField('measurementUnit', ''),
        createPathField('measurementValue', 'Marked Animals', ['Wildlife Health ID'])
      ]
    },
    {
      sheetName: 'measurementOrFact',
      condition: {
        type: 'and',
        checks: [{ ifNotEmpty: getValuesByName('Marked Animals', ['Animal ID']) }]
      },
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
          columnName: 'organismID',
          columnValue: [
            {
              paths: [getValuesByName('Marked Animals', ['_key']), getValuesByName('Marked Animals', ['_row'])]
            }
          ]
        },
        {
          columnName: 'measurementID',
          columnValue: [
            {
              paths: [getValuesByName('Marked Animals', ['_key']), getValuesByName('Marked Animals', ['_row'])],
              postfix: {
                static: 'animal-id'
              }
            }
          ]
        },
        createValueField('measurementType', 'Animal ID'),
        createValueField('measurementUnit', ''),
        createPathField('measurementValue', 'Marked Animals', ['Animal ID'])
      ]
    },
    {
      sheetName: 'measurementOrFact',
      condition: {
        type: 'and',
        checks: [{ ifNotEmpty: getValuesByName('Marked Animals', ['Telemetry Device ID']) }]
      },
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
          columnName: 'organismID',
          columnValue: [
            {
              paths: [getValuesByName('Marked Animals', ['_key']), getValuesByName('Marked Animals', ['_row'])]
            }
          ]
        },
        {
          columnName: 'measurementID',
          columnValue: [
            {
              paths: [getValuesByName('Marked Animals', ['_key']), getValuesByName('Marked Animals', ['_row'])],
              postfix: {
                static: 'telemetry-device-id'
              }
            }
          ]
        },
        createValueField('measurementType', 'Telemetry Device ID'),
        createValueField('measurementUnit', ''),
        createPathField('measurementValue', 'Marked Animals', ['Telemetry Device ID'])
      ]
    },
    {
      sheetName: 'measurementOrFact',
      condition: {
        type: 'and',
        checks: [{ ifNotEmpty: getValuesByName('Marked Animals', ['Collar/Tag Frequency']) }]
      },
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
          columnName: 'organismID',
          columnValue: [
            {
              paths: [getValuesByName('Marked Animals', ['_key']), getValuesByName('Marked Animals', ['_row'])]
            }
          ]
        },
        {
          columnName: 'measurementID',
          columnValue: [
            {
              paths: [getValuesByName('Marked Animals', ['_key']), getValuesByName('Marked Animals', ['_row'])],
              postfix: {
                static: 'collar/tag-frequency'
              }
            }
          ]
        },
        createValueField('measurementType', 'Collar/Tag Frequency'),
        createPathField('measurementUnit', 'Marked Animals', ['Frequency Unit']),
        createPathField('measurementValue', 'Marked Animals', ['Collar/Tag Frequency'])
      ]
    },
    {
      sheetName: 'measurementOrFact',
      condition: {
        type: 'and',
        checks: [{ ifNotEmpty: getValuesByName('Marked Animals', ['Right Ear Tag ID']) }]
      },
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
          columnName: 'organismID',
          columnValue: [
            {
              paths: [getValuesByName('Marked Animals', ['_key']), getValuesByName('Marked Animals', ['_row'])]
            }
          ]
        },
        {
          columnName: 'measurementID',
          columnValue: [
            {
              paths: [getValuesByName('Marked Animals', ['_key']), getValuesByName('Marked Animals', ['_row'])],
              postfix: {
                static: 'right-ear-tag-id'
              }
            }
          ]
        },
        createValueField('measurementType', 'Right Ear Tag ID'),
        createValueField('measurementUnit', ''),
        createPathField('measurementValue', 'Marked Animals', ['Right Ear Tag ID'])
      ]
    },
    {
      sheetName: 'measurementOrFact',
      condition: {
        type: 'and',
        checks: [{ ifNotEmpty: getValuesByName('Marked Animals', ['Right Ear Tag Colour']) }]
      },
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
          columnName: 'organismID',
          columnValue: [
            {
              paths: [getValuesByName('Marked Animals', ['_key']), getValuesByName('Marked Animals', ['_row'])]
            }
          ]
        },
        {
          columnName: 'measurementID',
          columnValue: [
            {
              paths: [getValuesByName('Marked Animals', ['_key']), getValuesByName('Marked Animals', ['_row'])],
              postfix: {
                static: 'right-ear-tag-colour'
              }
            }
          ]
        },
        createValueField('measurementType', 'Right Ear Tag Colour'),
        createValueField('measurementUnit', ''),
        createPathField('measurementValue', 'Marked Animals', ['Right Ear Tag Colour'])
      ]
    },
    {
      sheetName: 'measurementOrFact',
      condition: {
        type: 'and',
        checks: [{ ifNotEmpty: getValuesByName('Marked Animals', ['Left Ear Tag ID']) }]
      },
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
          columnName: 'organismID',
          columnValue: [
            {
              paths: [getValuesByName('Marked Animals', ['_key']), getValuesByName('Marked Animals', ['_row'])]
            }
          ]
        },
        {
          columnName: 'measurementID',
          columnValue: [
            {
              paths: [getValuesByName('Marked Animals', ['_key']), getValuesByName('Marked Animals', ['_row'])],
              postfix: {
                static: 'left-ear-tag-id'
              }
            }
          ]
        },
        createValueField('measurementType', 'Left Ear Tag ID'),
        createValueField('measurementUnit', ''),
        createPathField('measurementValue', 'Marked Animals', ['Left Ear Tag ID'])
      ]
    },
    {
      sheetName: 'measurementOrFact',
      condition: {
        type: 'and',
        checks: [{ ifNotEmpty: getValuesByName('Marked Animals', ['Left Ear Tag Colour']) }]
      },
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
          columnName: 'organismID',
          columnValue: [
            {
              paths: [getValuesByName('Marked Animals', ['_key']), getValuesByName('Marked Animals', ['_row'])]
            }
          ]
        },
        {
          columnName: 'measurementID',
          columnValue: [
            {
              paths: [getValuesByName('Marked Animals', ['_key']), getValuesByName('Marked Animals', ['_row'])],
              postfix: {
                static: 'left-ear-tag-colour'
              }
            }
          ]
        },
        createValueField('measurementType', 'Left Ear Tag Colour'),
        createValueField('measurementUnit', ''),
        createPathField('measurementValue', 'Marked Animals', ['Left Ear Tag Colour'])
      ]
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
  ]
};
