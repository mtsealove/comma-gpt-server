import { execSync } from 'child_process';
import * as fs from 'fs';

const mecab = (text: string, callback: (str: string[][]) => void) => {
  text += '\n';

  fs.writeFileSync('TMP_INPUT_FILE', text, 'utf-8');

  const cmd = ['mecab', 'TMP_INPUT_FILE', '--output=TMP_OUTPUT_FILE'].join(' ');

  const opt = { encoding: 'utf-8' };
  let res = '';

  try {
    execSync(cmd);
    res = fs.readFileSync('TMP_OUTPUT_FILE', 'utf-8');
  } catch (e) {
    console.log(e);
  }

  res = res.replace(/\r/g, '');
  res = res.replace(/\s+$/, '');

  const lines = res.split('\n');

  const result = lines.map(function (line) {
    return line.replace('\t', ',').split(',');
  });

  callback(result);
};

export default mecab;
