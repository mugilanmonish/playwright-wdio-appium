import { test, expect } from '@playwright/test';
import { readJson, writeJson } from '../jsonData/jsonUtility';

type Data = {
  token: any;
};

test('Read and update JSON file', async () => {
  const data = readJson() as Data;
  console.log('Original:', data);

  data.token.newToken = 'updatedToken';
  writeJson(data);

  const updatedData = readJson();
  console.log('Updated:', updatedData);
});
