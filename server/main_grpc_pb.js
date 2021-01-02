// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var main_pb = require('./main_pb.js');

function serialize_covidtracking_Empty(arg) {
  if (!(arg instanceof main_pb.Empty)) {
    throw new Error('Expected argument of type covidtracking.Empty');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_covidtracking_Empty(buffer_arg) {
  return main_pb.Empty.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_covidtracking_professionList(arg) {
  if (!(arg instanceof main_pb.professionList)) {
    throw new Error('Expected argument of type covidtracking.professionList');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_covidtracking_professionList(buffer_arg) {
  return main_pb.professionList.deserializeBinary(new Uint8Array(buffer_arg));
}


var covidtrackingService = exports.covidtrackingService = {
  doctorProfessions: {
    path: '/covidtracking.covidtracking/doctorProfessions',
    requestStream: false,
    responseStream: false,
    requestType: main_pb.Empty,
    responseType: main_pb.professionList,
    requestSerialize: serialize_covidtracking_Empty,
    requestDeserialize: deserialize_covidtracking_Empty,
    responseSerialize: serialize_covidtracking_professionList,
    responseDeserialize: deserialize_covidtracking_professionList,
  },
};

exports.covidtrackingClient = grpc.makeGenericClientConstructor(covidtrackingService);
