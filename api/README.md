# SIMS Template Transform POC

## Setup

### Install Dependencies

```
npm install
```

### Add Template File

- Add a template to the `./src/input` folder.
- Update the `TEMPLATE_NAME` variable in `./src/index.ts` to the name of the template file

### Define Template Transform Schema

- Add a schema (see sample `./src/schema/moose_srb_schema.ts`)
- Set the `TEMPLATE_SCHEMA` variable in `./src/index.ts` to the value of the schema

## Run The Transform

```
npm run start
```

## Verify The Results

See the produced files in `./src/output`
