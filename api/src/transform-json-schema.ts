/**
 * A JSON-Schema definition for a `TransformSchema`.
 */
export const transformationConfigJSONSchema = {
  title: 'Transformation Schema',
  type: 'object',
  required: ['templateMeta', 'map', 'dwcMeta'],
  properties: {
    templateMeta: {
      type: 'array',
      items: {
        $ref: '#/$defs/TemplateSchema'
      },
      description:
        'Defines the hierarchical structure of the template, which columns represent keys, and the parent-child relationship of the sheets. Used to de-normalize the template data.'
    },
    map: {
      type: 'array',
      items: {
        $ref: '#/$defs/MapSchema'
      },
      description:
        'Defines the mapping operations that are executed against each flattened row of the template. Used to transform the template data into its corresponding dwc representation.'
    },
    dwcMeta: {
      type: 'array',
      items: {
        $ref: '#/$defs/DwcMeta'
      },
      description: 'Defines the unique keys for each dwc sheet. Used to normalize the dwc data.'
    }
  },
  $defs: {
    TemplateSchema: {
      title: 'Sheet Schema',
      type: 'object',
      required: ['sheetName', 'primaryKey', 'parentKey', 'type', 'foreignKeys'],
      properties: {
        sheetName: {
          type: 'string',
          description: 'The name of the template sheet'
        },
        primaryKey: {
          type: 'array',
          items: {
            type: 'string'
          },
          description: 'An array of template column names which combined represent a unique key for rows in this sheet.'
        },
        parentKey: {
          type: 'array',
          items: {
            type: 'string'
          },
          description:
            'An array of template column names which combined represent a unique key for the parent row of rows in this sheet.'
        },
        type: {
          type: 'string',
          enum: ['root', 'leaf', '']
        },
        foreignKeys: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              sheetName: {
                type: 'string',
                description: 'The name of a child template sheet'
              },
              primaryKey: {
                type: 'array',
                items: {
                  type: 'string',
                  description: 'A template column name.'
                },
                description:
                  'An array of template column names which combined represent a unique key for child rows of this sheet.'
              }
            },
            description: 'An array of child template sheets.',
            additionalProperties: false
          }
        }
      },
      additionalProperties: false
    },
    MapSchema: {
      title: 'Map Schema',
      type: 'object',
      required: ['sheetName', 'fields'],
      properties: {
        sheetName: {
          type: 'string',
          description: 'The name of the dwc sheet'
        },
        condition: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              enum: ['and', 'or']
            },
            checks: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  ifNotEmpty: {
                    type: 'string'
                  }
                }
              }
            }
          },
          description:
            'Defines a condition, which contains one or more checks that must be met in order to proceed processing this `MapSchema` item.',
          additionalProperties: false
        },
        fields: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              columnName: {
                type: 'string'
              },
              columnValue: {
                type: 'array',
                items: {
                  $ref: '#/$defs/MapColumnValueSchema'
                }
              }
            },
            additionalProperties: false
          }
        },
        add: {
          type: 'array',
          items: {
            $ref: '#/$defs/MapSchema'
          }
        }
      },
      additionalProperties: false
    },
    MapColumnValueSchema: {
      title: 'MapColumnValueSchema',
      type: 'object',
      oneOf: [{ required: ['paths'] }, { required: ['value'] }],
      properties: {
        paths: {
          type: 'array',
          items: {
            type: 'string'
          }
        },
        value: {
          type: 'string'
        },
        join: {
          type: 'string',
          default: ':',
          description: 'A string used when concatenating columns to create keys.'
        },
        postfix: {
          type: 'object',
          properties: {
            paths: {
              type: 'array',
              items: {
                type: 'string'
              }
            },
            value: {
              type: 'string'
            }
          }
        },
        condition: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              enum: ['and', 'or']
            },
            checks: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  ifNotEmpty: {
                    type: 'string'
                  }
                }
              }
            }
          },
          description:
            'Defines a condition, which contains one or more checks that must be met in order to proceed processing this `MapColumnValueSchema` item.',
          additionalProperties: false
        },
        add: {
          type: 'array',
          items: {
            $ref: '#/$defs/MapSchema'
          }
        }
      },
      additionalProperties: false
    },
    DwcMeta: {
      title: 'Dwc Schema',
      type: 'object',
      properties: {
        sheetName: {
          type: 'string',
          description: 'The name of the dwc sheet'
        },
        primaryKey: {
          type: 'array',
          items: {
            type: 'string',
            description: 'A dwc column name.'
          },
          description: 'An array of dwc column names which combined represent a unique key for rows in this sheet.'
        }
      },
      additionalProperties: false
    }
  },
  additionalProperties: false
};
