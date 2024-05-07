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
    let Acceleration={
      x:  0.0,
      y:  0.0,
      z:  0.0
    }
    let Velocity={
      x: 0.0,
      y:  0.0,
      z:  0.0
    }
    let prevVelocity={
      x: 0.0,
      y:  0.0,
      z:  0.0
    }
    let prevAcceleration={
      x: 0.0,
      y:  0.0,
      z:  0.0
    }
    let Position={
      x: 0.0,
      y: 0.0,
      z: 0.0
    }
    let prevPosition={
      x: 0.0,
      y: 0.0,
      z: 0.0
    }
    let d:1.0;
    let game=false;
    // MQTT üzenet fogadása
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
      let Accelerationjason = JSON.parse(message.toString())
      Acceleration.x= parseFloat(Accelerationjason.x);
      Acceleration.y= parseFloat(Accelerationjason.y);
      Acceleration.z= parseFloat(Accelerationjason.z);
      if(isNaN(Acceleration.x))
          console.log('x NaN')
          // Acceleration.x=0;}
      if(isNaN(Acceleration.y))
        console.log('y NaN')
        // Acceleration.y=0;
      if(isNaN(Acceleration.z))
        console.log('x NaN')
        // Acceleration.z=0;
      console.log('accx: '+Acceleration.x+' tipus: '+typeof(Acceleration.x));
      // velocity
      Velocity.x= prevVelocity.x+(prevAcceleration.x+Acceleration.x)/2*d;
      Velocity.y= prevVelocity.y+(prevAcceleration.y+Acceleration.y)/2*d;
      Velocity.z= prevVelocity.z+(prevAcceleration.z+Acceleration.z)/2*d;
      if(isNaN(Velocity.x))
        console.log('Velocity: x NaN')
      if(isNaN(Velocity.y))
        console.log('Velocity: y NaN')
      if(isNaN(Velocity.z))
        console.log('Velocity: z NaN')
      console.log('velx: ' +Velocity.x+' tipus: '+typeof(Velocity.x));
      //position
      Position.x=prevPosition.x+(prevVelocity.x+Velocity.x)/2*d;
      Position.y=prevPosition.y+(prevVelocity.x+Velocity.y)/2*d;
      Position.z=prevPosition.z+(prevVelocity.x+Velocity.z)/2*d;
      if(isNaN(Position.x))
        console.log('Velocity: x NaN')
      if(isNaN(Position.y))
        console.log('Velocity: y NaN')
      if(isNaN(Position.z))
        console.log('Velocity: z NaN')
      console.log('posx: '+Position.x+' tipus: '+typeof(Position.x));

      labda.setPosition(Position.x,Position.y,Position.z, 'relative');
      // labda.setPosition(Acceleration.x,Acceleration.y,Acceleration.z, 'relative');


      prevAcceleration=Acceleration;
      prevVelocity=Velocity;
      }
      else{
        Position={x:0,y:0,z:0};
        prevPosition={x:0,y:0,z:0};
        Velocity={x:0,y:0,z:0};
        prevVelocity={x:0,y:0,z:0};
        Acceleration={x:0,y:0,z:0};
        prevAcceleration={x:0,y:0,z:0};
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