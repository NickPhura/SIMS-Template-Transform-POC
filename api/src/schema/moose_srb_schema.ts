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
          name: 'Observations',
          primaryKey: ['Study Area', 'Block ID/SU ID', 'Stratum']
        },
        {
          name: 'Effort & Site Conditions',
          primaryKey: ['Study Area', 'Block ID/SU ID']
        }
      ]
    },
    {
      name: 'Effort & Site Conditions',
      primaryKey: ['Study Area', 'Block ID/SU ID'],
      parentKey: ['Study Area', 'Block ID/SU ID'],
      type: '',
      foreignKeys: []
    },
    {
      name: 'Observations',
      primaryKey: ['Study Area', 'Block ID/SU ID', 'Stratum'],
      parentKey: ['Study Area', 'Block ID/SU ID', 'Stratum'],
      type: '',
      foreignKeys: [
        {
          name: 'Marked Animals',
          primaryKey: ['Group Label']
        }
      ]
    },
    {
      name: 'Marked Animals',
      primaryKey: ['Wildlife Health ID'],
      parentKey: ['Group Label'],
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
              paths: [getValueByName('Observations', 'Date')]
            },
            {
              paths: [getValueByName('Effort & Site Conditions', 'Date')]
            }
          ]
        },
        {
          columnName: 'eventRemarks',
          columnValue: [
            {
              paths: [getValueByName('Block Summary', 'Block Summary Comments')]
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
              paths: [getMultipleValuesByName('Observations', ['UTM Zone', 'Easting', 'Northing'])],
              join: ' '
            },
            {
              paths: [getMultipleValuesByName('Observations', ['Lat (DD)', 'Long (DD)'])],
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
      condition: [{ if: getValueByName('Observations', 'Spike/Fork Bulls') }],
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
              postfix: 'auto'
            }
          ]
        },
        createPathField('individualCount', 'Observations', ['Spike/Fork Bulls']),
        createValueField('sex', 'male'),
        createValueField('lifeStage', 'unknown'),
        createPathField('taxonID', 'Observations', ['Species']),
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments'])
      ]
    },
    {
      name: 'occurrence',
      condition: [{ if: getValueByName('Observations', 'Sub-Prime Bulls') }],
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
              postfix: 'auto'
            }
          ]
        },
        createPathField('individualCount', 'Observations', ['Sub-Prime Bulls']),
        createValueField('sex', 'male'),
        createValueField('lifeStage', 'adult'),
        createPathField('taxonID', 'Observations', ['Species']),
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments'])
      ]
    },
    {
      name: 'occurrence',
      condition: [{ if: getValueByName('Observations', 'Prime Bulls') }],
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
              postfix: 'auto'
            }
          ]
        },
        createPathField('individualCount', 'Observations', ['Prime Bulls']),
        createValueField('sex', 'male'),
        createValueField('lifeStage', 'adult'),
        createPathField('taxonID', 'Observations', ['Species']),
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments'])
      ]
    },
    {
      name: 'occurrence',
      condition: [{ if: getValueByName('Observations', 'Senior Bulls') }],
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
              postfix: 'auto'
            }
          ]
        },
        createPathField('individualCount', 'Observations', ['Senior Bulls']),
        createValueField('sex', 'male'),
        createValueField('lifeStage', 'adult'),
        createPathField('taxonID', 'Observations', ['Species']),
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments'])
      ]
    },
    {
      name: 'occurrence',
      condition: [{ if: getValueByName('Observations', '3 Brow/10 Points Bulls') }],
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
              postfix: 'auto'
            }
          ]
        },
        createPathField('individualCount', 'Observations', ['3 Brow/10 Points Bulls']),
        createValueField('sex', 'male'),
        createValueField('lifeStage', 'adult'),
        createPathField('taxonID', 'Observations', ['Species']),
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments'])
      ]
    },
    {
      name: 'occurrence',
      condition: [{ if: getValueByName('Observations', 'BC RISC Yearling Bulls') }],
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
              postfix: 'auto'
            }
          ]
        },
        createPathField('individualCount', 'Observations', ['BC RISC Yearling Bulls']),
        createValueField('sex', 'male'),
        createValueField('lifeStage', 'adult'),
        createPathField('taxonID', 'Observations', ['Species']),
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments'])
      ]
    },
    {
      name: 'occurrence',
      condition: [{ if: getValueByName('Observations', 'BC RISC Class I Bulls') }],
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
              postfix: 'auto'
            }
          ]
        },
        createPathField('individualCount', 'Observations', ['BC RISC Class I Bulls']),
        createValueField('sex', 'male'),
        createValueField('lifeStage', 'adult'),
        createPathField('taxonID', 'Observations', ['Species']),
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments'])
      ]
    },
    {
      name: 'occurrence',
      condition: [{ if: getValueByName('Observations', 'BC RISC Class II Bulls') }],
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
              postfix: 'auto'
            }
          ]
        },
        createPathField('individualCount', 'Observations', ['BC RISC Class II Bulls']),
        createValueField('sex', 'male'),
        createValueField('lifeStage', 'adult'),
        createPathField('taxonID', 'Observations', ['Species']),
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments'])
      ]
    },
    {
      name: 'occurrence',
      condition: [{ if: getValueByName('Observations', 'BC RISC Class III Bulls') }],
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
              postfix: 'auto'
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
    {
      name: 'occurrence',
      condition: [{ if: getValueByName('Observations', 'Oswald (1997) Class I Bulls') }],
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
              postfix: 'auto'
            }
          ]
        },
        createPathField('individualCount', 'Observations', ['Oswald (1997) Class I Bulls']),
        createValueField('sex', 'male'),
        createValueField('lifeStage', 'adult'),
        createPathField('taxonID', 'Observations', ['Species']),
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments'])
      ]
    },
    {
      name: 'occurrence',
      condition: [{ if: getValueByName('Observations', 'Oswald (1997) Class II Bulls') }],
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
              postfix: 'auto'
            }
          ]
        },
        createPathField('individualCount', 'Observations', ['Oswald (1997) Class II Bulls']),
        createValueField('sex', 'male'),
        createValueField('lifeStage', 'adult'),
        createPathField('taxonID', 'Observations', ['Species']),
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments'])
      ]
    },
    {
      name: 'occurrence',
      condition: [{ if: getValueByName('Observations', 'Oswald (1997) Class III Bulls') }],
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
              postfix: 'auto'
            }
          ]
        },
        createPathField('individualCount', 'Observations', ['Oswald (1997) Class III Bulls']),
        createValueField('sex', 'male'),
        createValueField('lifeStage', 'adult'),
        createPathField('taxonID', 'Observations', ['Species']),
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments'])
      ]
    },
    {
      name: 'occurrence',
      condition: [{ if: getValueByName('Observations', 'Adult Bulls - Unclassified') }],
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
              postfix: 'auto'
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
    {
      name: 'occurrence',
      condition: [{ if: getValueByName('Observations', 'Bulls - Unclassified') }],
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
              postfix: 'auto'
            }
          ]
        },
        createPathField('individualCount', 'Observations', ['Bulls - Unclassified']),
        createValueField('sex', 'male'),
        createValueField('lifeStage', 'unknown'),
        createPathField('taxonID', 'Observations', ['Species']),
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments'])
      ]
    },
    {
      name: 'occurrence',
      condition: [{ if: getValueByName('Observations', 'Cow') }],
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
              postfix: 'auto'
            }
          ]
        },
        createPathField('individualCount', 'Observations', ['Cow']),
        createValueField('sex', 'female'),
        createValueField('lifeStage', 'adult'),
        createPathField('taxonID', 'Observations', ['Species']),
        createPathField('occurrenceRemarks', 'Observations', ['Observation Comments'])
      ]
    },
    {
      name: 'occurrence',
      condition: [{ if: getValueByName('Observations', 'Calves') }],
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
              postfix: 'auto'
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
    {
      name: 'occurrence',
      condition: [{ if: getValueByName('Observations', 'Adult Unclassified Sex') }],
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
              postfix: 'auto'
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
    {
      name: 'occurrence',
      condition: [{ if: getValueByName('Observations', 'Unclassified Age/Sex') }],
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
              postfix: 'auto'
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
      name: 'organism',
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
          columnName: 'organismID',
          columnValue: [
            {
              paths: [getMultipleValuesByName('Marked Animals', ['Wildlife Health ID', 'Animal ID'])],
              join: '|'
            }
          ]
        },
        createPathField('organismRemarks', 'Marked Animals', ['Marked Animals Comments'])
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
        createValueField('measurementType', 'Study Area'),
        createValueField('measurementUnit', 'Text'),
        createPathField('measurementValue', 'Block Summary', ['Study Area'])
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
        createValueField('measurementType', 'Block ID/SU ID'),
        createValueField('measurementUnit', 'ID'),
        createPathField('measurementValue', 'Block Summary', ['Block ID/SU ID'])
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
        createValueField('measurementType', 'Stratum'),
        createValueField('measurementUnit', 'Text'),
        createPathField('measurementValue', 'Block Summary', ['Stratum'])
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
        createValueField('measurementType', 'Stratum/Block Area'),
        createValueField('measurementUnit', 'km2'),
        createPathField('measurementValue', 'Block Summary', ['Stratum/Block Area (km2)'])
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
        createValueField('measurementType', 'Sampled'),
        createValueField('measurementUnit', 'Y/N'),
        createPathField('measurementValue', 'Block Summary', ['Sampled (Y/N)'])
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
        createValueField('measurementType', 'Group Label'),
        createValueField('measurementUnit', 'Text'),
        createPathField('measurementValue', 'Observations', ['Group Label'])
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
        createValueField('measurementType', 'Cow W/1 calf'),
        createValueField('measurementUnit', 'Number'),
        createPathField('measurementValue', 'Observations', ['Cow W/1 calf'])
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
        createValueField('measurementType', 'Cow W/2 calves'),
        createValueField('measurementUnit', 'Number'),
        createPathField('measurementValue', 'Observations', ['Cow W/2 calves'])
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
        createValueField('measurementType', 'Sign Type'),
        createValueField('measurementUnit', 'Text'),
        createPathField('measurementValue', 'Observations', ['Sign Type'])
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
        createValueField('measurementType', 'Age of Sign'),
        createValueField('measurementUnit', 'Text'),
        createPathField('measurementValue', 'Observations', ['Age of Sign'])
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
        createValueField('measurementType', 'Veg Cover'),
        createValueField('measurementUnit', '%'),
        createPathField('measurementValue', 'Observations', ['Veg Cover (%)'])
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
        createValueField('measurementType', 'Snow Cover'),
        createValueField('measurementUnit', '%'),
        createPathField('measurementValue', 'Observations', ['Snow Cover (%)'])
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
        createValueField('measurementType', 'Activity'),
        createValueField('measurementUnit', 'Text'),
        createPathField('measurementValue', 'Observations', ['Activity'])
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
        createValueField('measurementType', 'Number of Marked Animals Observed'),
        createValueField('measurementUnit', 'Number'),
        createPathField('measurementValue', 'Observations', ['Number of Marked Animals Observed'])
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
        createValueField('measurementType', 'Survey or Telemetry Search'),
        createValueField('measurementUnit', 'Text'),
        createPathField('measurementValue', 'Observations', ['Survey or Telemetry Search'])
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
        createValueField('measurementType', 'Photos'),
        createValueField('measurementUnit', 'Text'),
        createPathField('measurementValue', 'Observations', ['Photos'])
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
          columnName: 'organismID',
          columnValue: [
            {
              paths: [getMultipleValuesByName('Marked Animals', ['Wildlife Health ID', 'Animal ID'])],
              join: '|'
            }
          ]
        },
        createValueField('measurementType', 'Targeted or Non-Targeted'),
        createValueField('measurementUnit', 'Text'),
        createPathField('measurementValue', 'Marked Animals', ['Targeted or Non-Targeted'])
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
          columnName: 'organismID',
          columnValue: [
            {
              paths: [getMultipleValuesByName('Marked Animals', ['Wildlife Health ID', 'Animal ID'])],
              join: '|'
            }
          ]
        },
        createValueField('measurementType', 'Wildlife Health ID'),
        createValueField('measurementUnit', 'Text'),
        createPathField('measurementValue', 'Marked Animals', ['Wildlife Health ID'])
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
          columnName: 'organismID',
          columnValue: [
            {
              paths: [getMultipleValuesByName('Marked Animals', ['Wildlife Health ID', 'Animal ID'])],
              join: '|'
            }
          ]
        },
        createValueField('measurementType', 'Animal ID'),
        createValueField('measurementUnit', 'Text'),
        createPathField('measurementValue', 'Marked Animals', ['Animal ID'])
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
          columnName: 'organismID',
          columnValue: [
            {
              paths: [getMultipleValuesByName('Marked Animals', ['Wildlife Health ID', 'Animal ID'])],
              join: '|'
            }
          ]
        },
        createValueField('measurementType', 'Telemetry Device ID'),
        createValueField('measurementUnit', 'Text'),
        createPathField('measurementValue', 'Marked Animals', ['Telemetry Device ID'])
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
          columnName: 'organismID',
          columnValue: [
            {
              paths: [getMultipleValuesByName('Marked Animals', ['Wildlife Health ID', 'Animal ID'])],
              join: '|'
            }
          ]
        },
        createValueField('measurementType', 'Collar/Tag Frequency'),
        createValueField('measurementUnit', 'Text'),
        createPathField('measurementValue', 'Marked Animals', ['Collar/Tag Frequency'])
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
          columnName: 'organismID',
          columnValue: [
            {
              paths: [getMultipleValuesByName('Marked Animals', ['Wildlife Health ID', 'Animal ID'])],
              join: '|'
            }
          ]
        },
        createValueField('measurementType', 'Frequency'),
        createPathField('measurementUnit', 'Marked Animals', ['Frequency Unit']),
        createPathField('measurementValue', 'Marked Animals', ['Frequency'])
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
          columnName: 'organismID',
          columnValue: [
            {
              paths: [getMultipleValuesByName('Marked Animals', ['Wildlife Health ID', 'Animal ID'])],
              join: '|'
            }
          ]
        },
        createValueField('measurementType', 'Right Ear Tag ID'),
        createValueField('measurementUnit', 'Text'),
        createPathField('measurementValue', 'Marked Animals', ['Right Ear Tag ID'])
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
          columnName: 'organismID',
          columnValue: [
            {
              paths: [getMultipleValuesByName('Marked Animals', ['Wildlife Health ID', 'Animal ID'])],
              join: '|'
            }
          ]
        },
        createValueField('measurementType', 'Right Ear Tag Colour'),
        createValueField('measurementUnit', 'Text'),
        createPathField('measurementValue', 'Marked Animals', ['Right Ear Tag Colour'])
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
          columnName: 'organismID',
          columnValue: [
            {
              paths: [getMultipleValuesByName('Marked Animals', ['Wildlife Health ID', 'Animal ID'])],
              join: '|'
            }
          ]
        },
        createValueField('measurementType', 'Left Ear Tag ID'),
        createValueField('measurementUnit', 'Text'),
        createPathField('measurementValue', 'Marked Animals', ['Left Ear Tag ID'])
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
          columnName: 'organismID',
          columnValue: [
            {
              paths: [getMultipleValuesByName('Marked Animals', ['Wildlife Health ID', 'Animal ID'])],
              join: '|'
            }
          ]
        },
        createValueField('measurementType', 'Left Ear Tag Colour'),
        createValueField('measurementUnit', 'Text'),
        createPathField('measurementValue', 'Marked Animals', ['Left Ear Tag Colour'])
      ]
    }
  ],
  dwcMeta: [
    {
      name: 'event',
      primaryKey: ['eventID']
    },
    {
      name: 'location',
      primaryKey: ['eventID']
    },
    {
      name: 'occurrence',
      primaryKey: ['occurrenceID']
    },
    {
      name: 'organism',
      primaryKey: ['organismID ']
    },
    {
      name: 'measurementOrFact',
      primaryKey: ['eventID', 'occurrenceID']
    }
  ]
};
