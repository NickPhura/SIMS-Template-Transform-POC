/**
 * A JSON-Schema definition for a `TransformSchema`.
 */
export const transformationJSONSchema = {
  title: 'Transformation Schema',
  type: 'object',
  required: ['templateMeta', 'map', 'dwcMeta'],
  properties: {
    templateMeta: {
      type: 'array',
      items: {
        $ref: '#/$defs/TemplateSchema'
      }
    },
    map: {
      type: 'array',
      items: {
        $ref: '#/$defs/MapSchema'
      }
    },
    dwcMeta: {
      type: 'array',
      items: {
        $ref: '#/$defs/DwcMeta'
      }
    }
  },
  $defs: {
    TemplateSchema: {
      title: 'Sheet Schema',
      type: 'object',
      required: ['name', 'primaryKey', 'parentKey', 'type', 'foreignKeys'],
      properties: {
        name: {
          type: 'string'
        },
        primaryKey: {
          type: 'array',
          items: {
            type: 'string'
          }
        },
        parentKey: {
          type: 'array',
          items: {
            type: 'string'
          }
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
              name: {
                type: 'string'
              },
              primaryKey: {
                type: 'array',
                items: {
                  type: 'string'
                }
              }
            },
            additionalProperties: false
          }
        }
      },
      additionalProperties: false
    },
    MapSchema: {
      title: 'Map Schema',
      type: 'object',
      required: ['name', 'fields'],
      properties: {
        name: {
          type: 'string'
        },
        condition: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              if: {
                type: 'string'
              }
            },
            additionalProperties: false
          }
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
          type: 'string'
        },
        postfix: {
          type: 'string'
        },
        condition: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              if: {
                type: 'string'
              }
            }
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
    DwcMeta: {
      title: 'Dwc Schema',
      type: 'object',
      properties: {
        name: {
          type: 'string'
        },
        primaryKey: {
          type: 'array',
          items: {
            type: 'string'
          }
        }
      },
      additionalProperties: false
    }
  },
  additionalProperties: false
};
