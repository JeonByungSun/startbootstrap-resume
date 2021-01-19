import{ObjectWrapper as t}from"../../common/common.js";import{Multimap as e}from"../../platform/platform.js";import{UIUtils as o}from"../../ui/ui.js";const d={In:Symbol("In"),Out:Symbol("Out"),Param:Symbol("Param")};var a=Object.freeze({__proto__:null,PortPadding:4,InputPortRadius:10,AudioParamRadius:5,LeftMarginOfText:12,RightMarginOfText:30,LeftSideTopPadding:5,BottomPaddingWithoutParam:6,BottomPaddingWithParam:8,ArrowHeadSize:12,GraphPadding:20,GraphMargin:20,TotalInputPortHeight:24,TotalOutputPortHeight:24,TotalParamPortHeight:14,NodeLabelFontStyle:"14px Segoe UI, Arial",ParamLabelFontStyle:"12px Segoe UI, Arial",PortTypes:d,Size:undefined,Point:undefined,NodeLayout:undefined,Port:undefined,NodeCreationData:undefined,ParamCreationData:undefined,NodesConnectionData:undefined,NodesDisconnectionData:undefined,NodesDisconnectionDataWithDestination:undefined,NodeParamConnectionData:undefined,NodeParamDisconnectionData:undefined});const n=t=>({x:0,y:15+24*t}),i=(t,e,o)=>{const{width:d,height:a}=e;return{x:d,y:a/2+24*(2*t-o+1)/2}},r=(t,e)=>({x:0,y:e+14*(t+1)-5});var s=Object.freeze({__proto__:null,calculateInputPortXY:n,calculateOutputPortXY:i,calculateParamPortXY:r});class h{constructor(t,e){this.id=t.nodeId,this.type=t.nodeType,this.numberOfInputs=t.numberOfInputs,this.numberOfOutputs=t.numberOfOutputs,this.label=e,this.size={width:0,height:0},this.position=null,this._layout={inputPortSectionHeight:0,outputPortSectionHeight:0,maxTextLength:0,totalHeight:0},this.ports=new Map,this._initialize(t)}_initialize(t){this._updateNodeLayoutAfterAddingNode(t),this._setupInputPorts(),this._setupOutputPorts()}addParamPort(t,e){const o=this.getPortsByType(d.Param).length,{x:a,y:n}=r(o,this._layout.inputPortSectionHeight);this._addPort({id:l(this.id,t),type:d.Param,label:e,x:a,y:n}),this._updateNodeLayoutAfterAddingParam(o+1,e),this._setupOutputPorts()}getPortsByType(t){const e=[];return this.ports.forEach((o=>{o.type===t&&e.push(o)})),e}_updateNodeLayoutAfterAddingNode(t){const e=24*Math.max(1,t.numberOfInputs)+5;this._layout.inputPortSectionHeight=e,this._layout.outputPortSectionHeight=24*t.numberOfOutputs,this._layout.totalHeight=Math.max(e+6,this._layout.outputPortSectionHeight);const o=_(this.label,"14px Segoe UI, Arial");this._layout.maxTextLength=Math.max(this._layout.maxTextLength,o),this._updateNodeSize()}_updateNodeLayoutAfterAddingParam(t,e){const o=this._layout.inputPortSectionHeight+14*t+8;this._layout.totalHeight=Math.max(o,this._layout.outputPortSectionHeight);const d=_(e,"12px Segoe UI, Arial");this._layout.maxTextLength=Math.max(this._layout.maxTextLength,d),this._updateNodeSize()}_updateNodeSize(){this.size={width:Math.ceil(12+this._layout.maxTextLength+30),height:this._layout.totalHeight}}_setupInputPorts(){for(let t=0;t<this.numberOfInputs;t++){const{x:e,y:o}=n(t);this._addPort({id:u(this.id,t),type:d.In,x:e,y:o,label:void 0})}}_setupOutputPorts(){for(let t=0;t<this.numberOfOutputs;t++){const e=p(this.id,t),{x:o,y:a}=i(t,this.size,this.numberOfOutputs);if(this.ports.has(e)){const t=this.ports.get(e);if(!t)throw new Error("Unable to find port with id "+e);t.x=o,t.y=a}else this._addPort({id:e,type:d.Out,x:o,y:a,label:void 0})}}_addPort(t){this.ports.set(t.id,t)}}const u=(t,e)=>`${t}-input-${e||0}`,p=(t,e)=>`${t}-output-${e||0}`,l=(t,e)=>`${t}-param-${e}`;class c{constructor(){this._totalNumberOfNodes=0}generateLabel(t){t.endsWith("Node")&&(t=t.slice(0,t.length-4)),this._totalNumberOfNodes+=1;return`${t} ${this._totalNumberOfNodes}`}}let g;const _=(t,e)=>{if(!g){const t=document.createElement("canvas").getContext("2d");if(!t)throw new Error("Unable to create canvas context.");g=t}const d=g;d.save(),e&&(d.font=e);const a=o.measureTextWidth(d,t);return d.restore(),a};var m=Object.freeze({__proto__:null,NodeView:h,generateInputPortId:u,generateOutputPortId:p,generateParamPortId:l,NodeLabelGenerator:c,measureTextWidth:_});class I{constructor(t,e){const o=y(t,e);if(!o)throw new Error("Unable to generate edge port IDs");const{edgeId:d,sourcePortId:a,destinationPortId:n}=o;this.id=d,this.type=e,this.sourceId=t.sourceId,this.destinationId=t.destinationId,this.sourcePortId=a,this.destinationPortId=n}}const y=(t,e)=>{if(!t.sourceId||!t.destinationId)return console.error("Undefined node message: "+JSON.stringify(t)),null;const o=p(t.sourceId,t.sourceOutputIndex),d=function(t,e){if(e===P.NodeToNode){const e=t;return u(t.destinationId,e.destinationInputIndex)}if(e===P.NodeToParam){const e=t;return l(t.destinationId,e.destinationParamId)}return console.error("Unknown edge type: "+e.toString()),""}(t,e);return{edgeId:`${o}->${d}`,sourcePortId:o,destinationPortId:d}},P={NodeToNode:Symbol("NodeToNode"),NodeToParam:Symbol("NodeToParam")};var f=Object.freeze({__proto__:null,EdgeView:I,generateEdgePortIdsByData:y,EdgeTypes:P});class N extends t.ObjectWrapper{constructor(t){super(),this.contextId=t,this._nodes=new Map,this._edges=new Map,this._outboundEdgeMap=new e,this._inboundEdgeMap=new e,this._nodeLabelGenerator=new c,this._paramIdToNodeIdMap=new Map}addNode(t){const e=this._nodeLabelGenerator.generateLabel(t.nodeType),o=new h(t,e);this._nodes.set(t.nodeId,o),this._notifyShouldRedraw()}removeNode(t){this._outboundEdgeMap.get(t).forEach((t=>this._removeEdge(t))),this._inboundEdgeMap.get(t).forEach((t=>this._removeEdge(t))),this._nodes.delete(t),this._notifyShouldRedraw()}addParam(t){const e=this.getNodeById(t.nodeId);e?(e.addParamPort(t.paramId,t.paramType),this._paramIdToNodeIdMap.set(t.paramId,t.nodeId),this._notifyShouldRedraw()):console.error("AudioNode should be added before AudioParam")}removeParam(t){this._paramIdToNodeIdMap.delete(t)}addNodeToNodeConnection(t){const e=new I(t,P.NodeToNode);this._addEdge(e)}removeNodeToNodeConnection(t){if(t.destinationId){const e=y(t,P.NodeToNode);if(!e)throw new Error("Unable to generate edge port IDs");const{edgeId:o}=e;this._removeEdge(o)}else this._outboundEdgeMap.get(t.sourceId).forEach((t=>this._removeEdge(t)))}addNodeToParamConnection(t){const e=new I(t,P.NodeToParam);this._addEdge(e)}removeNodeToParamConnection(t){const e=y(t,P.NodeToParam);if(!e)throw new Error("Unable to generate edge port IDs");const{edgeId:o}=e;this._removeEdge(o)}getNodeById(t){return this._nodes.get(t)||null}getNodes(){return this._nodes}getEdges(){return this._edges}getNodeIdByParamId(t){return this._paramIdToNodeIdMap.get(t)||null}_addEdge(t){const e=t.sourceId;this._outboundEdgeMap.hasValue(e,t.id)||(this._edges.set(t.id,t),this._outboundEdgeMap.set(e,t.id),this._inboundEdgeMap.set(t.destinationId,t.id),this._notifyShouldRedraw())}_removeEdge(t){const e=this._edges.get(t);e&&(this._outboundEdgeMap.delete(e.sourceId,t),this._inboundEdgeMap.delete(e.destinationId,t),this._edges.delete(t),this._notifyShouldRedraw())}_notifyShouldRedraw(){this.dispatchEventToListeners(b.ShouldRedraw,this)}}const b={ShouldRedraw:Symbol("ShouldRedraw")};var x=Object.freeze({__proto__:null,GraphView:N,Events:b});class w extends t.ObjectWrapper{constructor(){super(),this._graphMapByContextId=new Map}createContext(t){const e=new N(t);e.addEventListener(b.ShouldRedraw,this._notifyShouldRedraw,this),this._graphMapByContextId.set(t,e)}destroyContext(t){if(!this._graphMapByContextId.has(t))return;const e=this._graphMapByContextId.get(t);e&&(e.removeEventListener(b.ShouldRedraw,this._notifyShouldRedraw,this),this._graphMapByContextId.delete(t))}hasContext(t){return this._graphMapByContextId.has(t)}clearGraphs(){this._graphMapByContextId.clear()}getGraph(t){return this._graphMapByContextId.get(t)||null}_notifyShouldRedraw(t){const e=t.data;this.dispatchEventToListeners(b.ShouldRedraw,e)}}var S=Object.freeze({__proto__:null,GraphManager:w});export{f as EdgeView,S as GraphManager,a as GraphStyle,x as GraphView,s as NodeRendererUtility,m as NodeView};
