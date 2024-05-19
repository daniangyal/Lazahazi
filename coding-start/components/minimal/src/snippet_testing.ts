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

import { ipcMain, BrowserWindow, Accelerator } from 'electron';
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
import _, { isNaN, last } from 'lodash';
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

// async _39applyLinearImpulse() {
//   let pengu = (await createDynamicPengu('dynamicPengu', {
//     x: 0,
//     y: 500,
//     z: 0,
//   })) as Mesh;
//   wom.render(pengu);
//   await utils.sleep(2000);
//   pengu.applyLinearImpulse({ x: 5, y: 0, z: 0 });
// }

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
    function impulzusfgv(proba:any, x2:any, y2:any, z2:any):void{
      console.log("Dobas...");
            // labda.setCoeffs({gravity: {x: 0, y: -9.81, z: 0}});
      // proba.physical:'link-type':'dynamic';
      // console.log(proba.autophysical);
      // proba.autophysical=true;
      // console.log(proba.autophysical);
      // proba.phyiscal['link-type'] = 'dynamic';
      proba.applyLinearImpulse({ x: x2*0.65, y: y2*0.65, z: z2*0.65 });
    }
    let labda= wom.create('mesh', {
      url: 'Sphere.mesh',
      scale: 30,
      autophysical: true,
      position: { x:-1200, y: 150, z: -2300 },
      // position: { x: 0, y: 500, z: 2500 },
      physical: {
        'link-type': 'dynamic',

        coefficients: {
          gravity: {
              x: 0,
              y: -9.81,
              z: 0,
            },
          }
        },
      class: 'kurva, dynamic',
    });
    // labda.setPosition({x: 0, y: 500, z: 2500});
    await womAsync.render(labda);
    // labda.setPosition({x: 0, y: 500, z: 2500});
    labda.on('click', (e) => {
    labda.setPosition({x: 0, y: 1000, z: 2500});
    console.log("click");
    })
    // labda.setPosition({x: 0, y: 500, z: 2500});
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
    let AccelerationHistory : typeof Acceleration[]=[];
    let PythagoreanResult :number;
    let PythagoreanResultHistory : number[]=[];
    let RollingMeans = {rollingMean6: 0, rollingMean50: 0,};
    let RollingMeansHistory : typeof RollingMeans[]=[];
    let d:1.0;
    let game=false;

    // function _39applyLinearImpulse() {
      //labda.applyLinearImpulse({ x: 5, y: 0, z: 0 });
      // labda.
  // }
    // MQTT üzenet fogadása
    function calculateMean(array: number[], n: number) {
      let sum = 0;
      for (let i = Math.max(0, array.length - n); i < array.length; i++) {
        sum += array[i];
      }
      return sum / Math.min(n, array.length);
    }
    function addRollingMean(rollingMean6: number, rollingMean50: number) {
      RollingMeansHistory.push({ rollingMean6, rollingMean50 });
    }
    function addAcceleration(x: number, y: number, z: number) {
      console.log("x: "+ x+"y: "+y+"z:" +z);
      AccelerationHistory.push({ x, y, z });
    }
    PythagoreanResult=0;
    let throwsense=true;
    client.on('message', function (topic, message) {
      // Inicializálás
      console.log('mqtt uzenet: '+message.toString());
      if(message.toString()=="Switch")
        {
          console.log('Switch');
          // labda.setPosition({x:-1200, y: 150, z: -2300});
          
          
          // labda.getPosition().x;
          throwsense=true;
        }
      //     {
      //       // let Switchjason =JSON.parse(message.toString())
      //       // if(Switchjason.X=="Switch")
      //       //   console.log('SwitchJason..')
      //       game=!game;
      //   console.log('Game state: ' +game.toString());}
      // if(game && message.toString()!="Switch"){
      else if(throwsense){
          // Store acceleration data

          let Accelerationjason = JSON.parse(message.toString())
          Acceleration = {
            x: parseFloat(Accelerationjason.x),
            y: parseFloat(Accelerationjason.y),
            z: parseFloat(Accelerationjason.z),
          };
          // AccelerationHistory.push(Acceleration.x, Acceleration.y, Acceleration.z);
          //console.log("Acc0: "+AccelerationHistory[0]);
          //if(AccelerationHistory.length>1)
          //  console.log('Acc1:'+AccelerationHistory[1]);

          addAcceleration(Acceleration.x, Acceleration.y, Acceleration.z);

          //console.log("2Acc0: "+AccelerationHistory[0].x + ", " + AccelerationHistory[0].y + ", "  + AccelerationHistory[0].z);
          //if(AccelerationHistory.length>1)
          //  console.log('2Acc1:'+AccelerationHistory[1]);

          // Calculate and store the Pythagorean result

          PythagoreanResult = Math.sqrt(Math.pow(Acceleration.x, 2) + Math.pow(Acceleration.y, 2) + Math.pow(Acceleration.z, 2));
          //console.log("pyt tipus: "+typeof(PythagoreanResult)+" :: "+ PythagoreanResult);
          PythagoreanResultHistory.push(PythagoreanResult);

          // Calculate and store the rolling means for the last 6 and 50 data
          
          if (PythagoreanResultHistory.length >= 7) RollingMeans.rollingMean6 = calculateMean(PythagoreanResultHistory, 6);
          else RollingMeans.rollingMean6 = 0;
          if (PythagoreanResultHistory.length == 51) RollingMeans.rollingMean50 = calculateMean(PythagoreanResultHistory, 50);   
          else RollingMeans.rollingMean50 = 0;
          // RollingMeansHistory.push(RollingMeans.rollingMean6, RollingMeans.rollingMean50);
          addRollingMean(RollingMeans.rollingMean6, RollingMeans.rollingMean50);
          console.log(RollingMeans.rollingMean6);
          if(RollingMeansHistory.length == 51)
          {
            if ((RollingMeansHistory[RollingMeansHistory.length - 5].rollingMean50 != 0) &&
            (RollingMeansHistory[RollingMeansHistory.length - 5].rollingMean6 > 2 * RollingMeans.rollingMean6) &&
            (RollingMeansHistory[RollingMeansHistory.length - 5].rollingMean6 > 2 * RollingMeansHistory[RollingMeansHistory.length - 5].rollingMean50) &&
            (RollingMeansHistory[RollingMeansHistory.length - 5].rollingMean6 > 25)) {
              signal = 1;
            }
            
              AccelerationHistory.shift();
              PythagoreanResultHistory.shift();
              RollingMeansHistory.shift();
            }
          console.log(signal.toString());
          if(signal==1){
            // labda.setCoeffs({gravity: {x: 0, y: -9.81, z: 0}});
            impulzusfgv(labda, AccelerationHistory[AccelerationHistory.length-8].x, AccelerationHistory[AccelerationHistory.length-8].y, AccelerationHistory[AccelerationHistory.length-8].z);
            signal=0;
            throwsense=false;
            for(let i=0;i<AccelerationHistory.length;i++){
              console.log("x: "+AccelerationHistory[i].x+" y: "+AccelerationHistory[i].y+" z: "+AccelerationHistory[i].z);
            }
            console.log("utso x:"+Acceleration.x+"utso y:"+Acceleration.y+"utso z:"+Acceleration.z);
            console.log("dobas x:"+AccelerationHistory[AccelerationHistory.length-8].x+"dobas y:"+AccelerationHistory[AccelerationHistory.length-8].y+"dobas z:"+AccelerationHistory[AccelerationHistory.length-8].z);
            AccelerationHistory=[];
            PythagoreanResultHistory=[];
            RollingMeansHistory=[];
          }
        }
        
      // if(message.toString() == "jump"){
      //   penguin.setPosition(0, -100, 0, 'relative');
      // }
      // else{
      //   console.log("wrong message");
      // }



    })


    
  }

//   async function myObject() ={
//     pengu = await this._01createMesh('pengu');
//     pengu.setPosition(1000, 1000, 1000);
//     pengu.applyLinearImpulse({});
//     return pengu.applyLinearImpulse({0,0,0});
//   }

//   async _01createMesh(position = { x: 0, y: 300, z: 0 }) {
//     let pengu = maxwhere_1.wom.create('mesh', {
//         url: 'penguin.mesh',
//         scale: 10,
//         position: position,
//         autophysical: true,
//         class: 'animal',
//     });
//     return pengu;
// }
// async _02setPosition() {
//     let pengu = await this._01createMesh('pengu');
//     pengu.setPosition(1000, 1000, 1000);
//     pengu.applyLinearImpulse({})
// }


  constructor(){
    let target = this._Createtarget('target', { x: -1200, y: 0, z: -4000 });
    // let target = this._Createtarget('target', { x: 0, y: 500, z: 0 });
    this._setOrientation();
    // let labda=this._Createball('labda', { x: 0, y: 500, z: 2500 });
    // this._08MeshHierarchy();
    this._ClickListenerOntarget();

    this._MQTT('mqttkliens');
  }
}