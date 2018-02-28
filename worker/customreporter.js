'use strict';

const Mocha = require('mocha');
const reporters = Mocha.reporters;
const { Base, Spec } = reporters;
const { trimArray } = require('../utils');
const utils = Mocha.utils;
let counter = 0;
const {TYPES,message}  =require('./process-communication')

let msg = message(process);


const failed = [];
const passed = [];
// const getPassedFailed = (_passed, _failed) => {
//   passed = _passed;
//   failed = _failed;
// }

function Reporter(runner) {
  this._spec = new Spec(runner);

  const suitePath = [];

  runner
    .on('suite', suite => {
      suitePath.push(suite.fullTitle());
      //   calcSuite(suite)
      //   console.log(`#### title:${suite.fullTitle()} length start:${suitePath.length} `);
    })
    .on('suite end', () => {
      const poped = suitePath.pop();

      //   console.log(`#### title:${poped} length end:${suitePath.length} `);
      if (suitePath.length == 0) {
        // console.error(JSON.stringify({ passed, failed }, null, 2));
     //   process.send({ passed, failed });
        let res = { passed, failed }
        msg.emit(TYPES.result,res)
      }
    })
    .on('pass', test => {
      passed.push(toJS(suitePath, test));
      //   checkIfAllTestCompleted(passed, failed, counter);
    })
    .on('fail', (test,err) => {
      failed.push(toJS(suitePath, test));
     // console.log(error,'err');
    //  msg.emit(TYPES.error,err);
      //   checkIfAllTestCompleted(passed, failed, counter);
    })
    .on('end', () => {
      //console.error(JSON.stringify({ passed, failed }, null, 2));
      console.log('###end');
    });
}

function toJS(suitePath, test) {
  const name = test.title;

  return {
    name,
    fullName: suitePath[suitePath.length - 1].concat(' ').concat([name]),
    suitePath: suitePath.slice(),
    file: test.file,
    
  };
}



utils.inherits(Reporter, Base);

module.exports = Reporter;
