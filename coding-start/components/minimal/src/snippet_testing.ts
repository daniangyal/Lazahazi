import {
  wom,
  context,
  modules,
  Mesh,
  Node,
  Vector3,
  NodeMouseEventObject,
  WomCommonEventObject,
  Section,
  PositionGeometry,
  Color,
} from 'maxwhere';
import path from 'path';

import { ipcMain, BrowserWindow } from 'electron';
import {
  Transform,
  utils,
  womAsync,
  camera,
  GeometryBuilder,
  AxesHelper,
  GridHelper,
  PolarGridHelper,
  CSG,
  MeshTransform,
} from '@mxw/next';
import * as THREE from '@mxw/three';
import U3 from '@mxw/three-utils';
import util from 'util';
import fs from 'fs';
import _ from 'lodash';
import EventEmitter from 'events';
import mqtt from 'mqtt';
import {resolve} from 'path'
import { stringify } from 'querystring';

// MaxWhere Coordinate System:

// +X = right
// -X = left
// +Y = up
// -Y = down
// +Z = forward
// -Z = backwards

export default class SnippetTesting {
  // Declare fields

async _Createtarget(id?: string, posi: Vector3 ={ x: 0, y:0, z:200}){
let target= wom.create('mesh', {
    id: id,
    url: 'celtabla.mesh',
    scale: 10,
    position: posi,
    autophysical: true,
    class: 'kurva',
  });
  await womAsync.render(target);

  return target;
}

// async _Createball(id?: string, posi: Vector3 ={ x: 0, y:0, z:200}){
//   let target= wom.create('mesh', {
//       id: id,
//       url: 'Sphere.mesh',
//       scale: 10,
//       position: posi,
//       autophysical: true,
//       class: 'kurva',
//     });
//     await womAsync.render(target);

//     return target;
//   }

async _ClickListenerOntarget(){
  let target=await this._Createtarget('target');
  target.on('click', (e) => {
  })
}

async _setOrientation(){
  let target= await this._Createtarget('target');
  target.setOrientation({w: 0.707, x: 0.707, y: 0, z:0 });
}
declare ballstartpos:
{
  x: 0,
  y: 500,
  z: 2500
}

  async _MQTT(id?: string) {
    let labda= wom.create('mesh', {
      url: 'Sphere.mesh',
      scale: 10,
      autophysical: true,
      class: 'kurva',
    });
    await womAsync.render(labda);
    labda.setPosition({x: 0, y: 500, z: 2500});
    console.log("MQTT...");
    const client  = mqtt.connect('wss://4e67ef57e7b74853ab48df4f2239cf2c.s1.eu.hivemq.cloud:8884/mqtt', {
      username: 'danika2',
      password: '12345678Aa',
      rejectUnauthorized: true,
      clientId: 'jatek127t812t78',
    })

    //console.log('hiba: '+console.error());

    console.log("MQTT connect:");

    // Feliratkozás a kliensre
    client.on('connect', function () {
      console.log("feliratkozas")
      // client.subscribe(['anyad2', 'Switchtopic'], function (err) {
      client.subscribe('anyad2', function (err) {
        if (!err) {
          console.log("MQTT connect success")
        }
        else
        {console.log("MQTT connect fail")}
      })
      // client.subscribe('PubishSwitch', function (err) {
      //   if (!err) {
      //     console.log("Subscribe to PublishSwitch success")
      //   }
      //   else
      //   {console.log("Subscribe to PublishSwitch fail")}
      // })
    })
    let signal = 0;
    let Acceleration = {x:0,y:0,z:0};
    let AccelerationHistory = [];
    let PythagoreanResult = 0;
    let PythagoreanResultHistory = [];
    let RollingMeans = {rollingMean6: 0, rollingMean50: 0,};
    let RollingMeansHistory = [];
    let d:1.0;
    let game=false;
    // MQTT üzenet fogadása
    function calculateMean(array: number[], n: number) {
      let sum = 0;
      for (let i = Math.max(0, array.length - n); i < array.length; i++) {
        sum += array[i];
      }
      return sum / Math.min(n, array.length);
    }
    
    client.on('message', function (topic, message) {
      // Inicializálás
      // console.log('mqtt uzenet: '+message.toString());
      // if(message.toString()=="Switch")
      //     {
      //       // let Switchjason =JSON.parse(message.toString())
      //       // if(Switchjason.X=="Switch")
      //       //   console.log('SwitchJason..')
      //       game=!game;
      //   console.log('Game state: ' +game.toString());}
      // if(game && message.toString()!="Switch"){
        if(true){
          // Store acceleration data

          let Accelerationjason = JSON.parse(message.toString())
          Acceleration = {
            x: parseFloat(Accelerationjason.x),
            y: parseFloat(Accelerationjason.y),
            z: parseFloat(Accelerationjason.z),
          };
          AccelerationHistory.push(Acceleration);

          // Calculate and store the Pythagorean result

          PythagoreanResult = Math.sqrt(Math.pow(Acceleration.x, 2) + Math.pow(Acceleration.y, 2) + Math.pow(Acceleration.z, 2));
          PythagoreanResultHistory.push(PythagoreanResult);

          // Calculate and store the rolling means for the last 6 and 50 data
          
          if (PythagoreanResultHistory.length == 7) RollingMeans.rollingMean6 = calculateMean(PythagoreanResultHistory, 6);
          else RollingMeans.rollingMean6 = 0;
          if (PythagoreanResultHistory.length == 51) RollingMeans.rollingMean50 = calculateMean(PythagoreanResultHistory, 50);   
          else RollingMeans.rollingMean50 = 0;

          RollingMeansHistory.push(RollingMeans);

          if ((RollingMeans.rollingMean50 != 0) &&
          (RollingMeansHistory[RollingMeansHistory.length - 5].rollingMean6 > 2 * RollingMeans.rollingMean6) &&
          (RollingMeansHistory[RollingMeansHistory.length - 5].rollingMean6 > 2 * RollingMeansHistory[RollingMeansHistory.length - 5].rollingMean50) &&
          (RollingMeansHistory[RollingMeansHistory.length - 5].rollingMean6 > 25)) {
          signal = 1;
          }

          if(AccelerationHistory.length ==51) AccelerationHistory.shift();
          if(PythagoreanResultHistory.length == 51) PythagoreanResultHistory.shift();
          if(RollingMeansHistory.length == 51) RollingMeansHistory.shift();
      // labda.setPosition(Acceleration.x,Acceleration.y,Acceleration.z, 'relative');
        }

      // if(message.toString() == "jump"){
      //   penguin.setPosition(0, -100, 0, 'relative');
      // }
      // else{
      //   console.log("wrong message");
      // }


    })

  }
  constructor(){
    let target = this._Createtarget('target', { x: 0, y: 500, z: 0 });
    this._setOrientation();
    // let labda=this._Createball('labda', { x: 0, y: 500, z: 2500 });
    // this._08MeshHierarchy();
    this._ClickListenerOntarget();

    this._MQTT('mqttkliens');
  }
}