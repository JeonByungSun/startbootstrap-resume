import{SDKModel as e,DOMModel as t,OverlayModel as i,ResourceTreeModel as s,NetworkManager as n,EmulationModel as o,ScreenCaptureModel as a}from"../sdk/sdk.js";import{Settings as r,Color as h,ResourceType as l}from"../common/common.js";import{i18n as d}from"../i18n/i18n.js";import{Widget as c,ARIAUtils as _,UIUtils as g,KeyboardShortcut as u,Toolbar as m,RootView as v,SplitWidget as p,InspectorView as f}from"../ui/ui.js";import{InspectorFrontendHost as E}from"../host/host.js";class y extends e.SDKModel{constructor(e){super(e),this._inputAgent=e.inputAgent(),this._activeTouchOffsetTop=null,this._activeTouchParams=null}emitKeyEvent(e){let t;switch(e.type){case"keydown":t=Protocol.Input.DispatchKeyEventRequestType.KeyDown;break;case"keyup":t=Protocol.Input.DispatchKeyEventRequestType.KeyUp;break;case"keypress":t=Protocol.Input.DispatchKeyEventRequestType.Char;break;default:return}const i=e,s="keypress"===e.type?String.fromCharCode(i.charCode):void 0;this._inputAgent.invoke_dispatchKeyEvent({type:t,modifiers:this._modifiersForEvent(i),text:s,unmodifiedText:s?s.toLowerCase():void 0,keyIdentifier:i.keyIdentifier,code:i.code,key:i.key,windowsVirtualKeyCode:i.keyCode,nativeVirtualKeyCode:i.keyCode,autoRepeat:!1,isKeypad:!1,isSystemKey:!1})}emitTouchFromMouseEvent(e,t,i){const s=["none","left","middle","right"],n={mousedown:"mousePressed",mouseup:"mouseReleased",mousemove:"mouseMoved",mousewheel:"mouseWheel"},o=e.type;if(!(o in n))return;const a=e;if(!(a.which in s))return;if("mousewheel"!==o&&"none"===s[a.which])return;"mousedown"!==o&&null!==this._activeTouchOffsetTop||(this._activeTouchOffsetTop=t);const r=Math.round(a.offsetX/i);let h=Math.round(a.offsetY/i);h=Math.round(h-this._activeTouchOffsetTop);const l={type:n[o],x:r,y:h,modifiers:0,button:s[a.which],clickCount:0};if("mousewheel"===e.type){const e=a;l.deltaX=e.deltaX/i,l.deltaY=-e.deltaY/i}else this._activeTouchParams=l;"mouseup"===e.type&&(this._activeTouchOffsetTop=null),this._inputAgent.invoke_emulateTouchFromMouseEvent(l)}cancelTouch(){if(null!==this._activeTouchParams){const e=this._activeTouchParams;this._activeTouchParams=null,e.type="mouseReleased",this._inputAgent.invoke_emulateTouchFromMouseEvent(e)}}_modifiersForEvent(e){return(e.altKey?1:0)|(e.ctrlKey?2:0)|(e.metaKey?4:0)|(e.shiftKey?8:0)}}e.SDKModel.register(y,e.Capability.Input,!1);var b=Object.freeze({__proto__:null,InputModel:y});const C={screencastViewOfDebugTarget:"Screencast view of debug target",theTabIsInactive:"The tab is inactive",profilingInProgress:"Profiling in progress",back:"back",forward:"forward",reload:"reload",addressBar:"Address bar"},w=d.registerUIStrings("screencast/ScreencastView.js",C),M=d.getLocalizedString.bind(void 0,w);class T extends c.VBox{constructor(e){super(),this._screenCaptureModel=e,this._domModel=e.target().model(t.DOMModel),this._overlayModel=e.target().model(i.OverlayModel),this._resourceTreeModel=e.target().model(s.ResourceTreeModel),this._networkManager=e.target().model(n.NetworkManager),this._inputModel=e.target().model(y),this.setMinimumSize(150,150),this.registerRequiredCSS("screencast/screencastView.css",{enableLegacyPatching:!0}),this._shortcuts={},this._scrollOffsetX=0,this._scrollOffsetY=0,this._screenZoom=1,this._screenOffsetTop=0,this._pageScaleFactor=1,this._imageElement,this._viewportElement,this._glassPaneElement,this._canvasElement,this._titleElement,this._context,this._imageZoom=1,this._tagNameElement,this._attributeElement,this._nodeWidthElement,this._nodeHeightElement,this._model,this._highlightConfig,this._navigationUrl,this._navigationBack,this._navigationForward}initialize(){this.element.classList.add("screencast"),this._createNavigationBar(),this._viewportElement=this.element.createChild("div","screencast-viewport hidden"),this._canvasContainerElement=this._viewportElement.createChild("div","screencast-canvas-container"),this._glassPaneElement=this._canvasContainerElement.createChild("div","screencast-glasspane fill hidden"),this._canvasElement=this._canvasContainerElement.createChild("canvas"),_.setAccessibleName(this._canvasElement,M(C.screencastViewOfDebugTarget)),this._canvasElement.tabIndex=0,this._canvasElement.addEventListener("mousedown",this._handleMouseEvent.bind(this),!1),this._canvasElement.addEventListener("mouseup",this._handleMouseEvent.bind(this),!1),this._canvasElement.addEventListener("mousemove",this._handleMouseEvent.bind(this),!1),this._canvasElement.addEventListener("mousewheel",this._handleMouseEvent.bind(this),!1),this._canvasElement.addEventListener("click",this._handleMouseEvent.bind(this),!1),this._canvasElement.addEventListener("contextmenu",this._handleContextMenuEvent.bind(this),!1),this._canvasElement.addEventListener("keydown",this._handleKeyEvent.bind(this),!1),this._canvasElement.addEventListener("keyup",this._handleKeyEvent.bind(this),!1),this._canvasElement.addEventListener("keypress",this._handleKeyEvent.bind(this),!1),this._canvasElement.addEventListener("blur",this._handleBlurEvent.bind(this),!1),this._titleElement=this._canvasContainerElement.createChild("div","screencast-element-title monospace hidden -theme-not-patched"),this._tagNameElement=this._titleElement.createChild("span","screencast-tag-name"),this._attributeElement=this._titleElement.createChild("span","screencast-attribute"),g.createTextChild(this._titleElement," ");const t=this._titleElement.createChild("span","screencast-dimension");this._nodeWidthElement=t.createChild("span"),g.createTextChild(t," × "),this._nodeHeightElement=t.createChild("span"),this._titleElement.style.top="0",this._titleElement.style.left="0",this._imageElement=new Image,this._isCasting=!1,this._context=this._canvasElement.getContext("2d"),this._checkerboardPattern=this._createCheckerboardPattern(this._context),this._shortcuts[u.KeyboardShortcut.makeKey("l",u.Modifiers.Ctrl)]=this._focusNavigationBar.bind(this),e.TargetManager.instance().addEventListener(e.Events.SuspendStateChanged,this._onSuspendStateChange,this),this._updateGlasspane()}wasShown(){this._startCasting()}willHide(){this._stopCasting()}_startCasting(){if(e.TargetManager.instance().allTargetsSuspended())return;if(this._isCasting)return;this._isCasting=!0;const t=this._viewportDimensions();if(t.width<0||t.height<0)this._isCasting=!1;else{t.width*=window.devicePixelRatio,t.height*=window.devicePixelRatio,this._screenCaptureModel.startScreencast(Protocol.Page.StartScreencastRequestFormat.Jpeg,80,Math.floor(Math.min(2048,t.width)),Math.floor(Math.min(2048,t.height)),void 0,this._screencastFrame.bind(this),this._screencastVisibilityChanged.bind(this));for(const t of e.TargetManager.instance().models(o.EmulationModel))t.overrideEmulateTouch(!0);this._overlayModel&&this._overlayModel.setHighlighter(this)}}_stopCasting(){if(this._isCasting){this._isCasting=!1,this._screenCaptureModel.stopScreencast();for(const t of e.TargetManager.instance().models(o.EmulationModel))t.overrideEmulateTouch(!1);this._overlayModel&&this._overlayModel.setHighlighter(null)}}_screencastFrame(e,t){this._imageElement.onload=()=>{this._pageScaleFactor=t.pageScaleFactor,this._screenOffsetTop=t.offsetTop,this._scrollOffsetX=t.scrollOffsetX,this._scrollOffsetY=t.scrollOffsetY;const e=t.deviceHeight/t.deviceWidth,i=this._viewportDimensions();this._imageZoom=Math.min(i.width/this._imageElement.naturalWidth,i.height/(this._imageElement.naturalWidth*e)),this._viewportElement.classList.remove("hidden");const s=x;this._imageZoom<1.01/window.devicePixelRatio&&(this._imageZoom=1/window.devicePixelRatio),this._screenZoom=this._imageElement.naturalWidth*this._imageZoom/t.deviceWidth,this._viewportElement.style.width=t.deviceWidth*this._screenZoom+s+"px",this._viewportElement.style.height=t.deviceHeight*this._screenZoom+s+"px",this._highlightNode&&this.highlightInOverlay({node:this._highlightNode,selectorList:void 0},this._highlightConfig)},this._imageElement.src="data:image/jpg;base64,"+e}_isGlassPaneActive(){return!this._glassPaneElement.classList.contains("hidden")}_screencastVisibilityChanged(e){this._targetInactive=!e,this._updateGlasspane()}_onSuspendStateChange(t){e.TargetManager.instance().allTargetsSuspended()?this._stopCasting():this._startCasting(),this._updateGlasspane()}_updateGlasspane(){this._targetInactive?(this._glassPaneElement.textContent=M(C.theTabIsInactive),this._glassPaneElement.classList.remove("hidden")):e.TargetManager.instance().allTargetsSuspended()?(this._glassPaneElement.textContent=M(C.profilingInProgress),this._glassPaneElement.classList.remove("hidden")):this._glassPaneElement.classList.add("hidden")}async _handleMouseEvent(e){if(this._isGlassPaneActive())return void e.consume();if(!this._pageScaleFactor||!this._domModel)return;if(!this._inspectModeConfig||"mousewheel"===e.type)return this._inputModel&&this._inputModel.emitTouchFromMouseEvent(e,this._screenOffsetTop,this._screenZoom),e.preventDefault(),void("mousedown"===e.type&&this._canvasElement.focus());const t=this._convertIntoScreenSpace(e),i=await this._domModel.nodeForLocation(Math.floor(t.x/this._pageScaleFactor+this._scrollOffsetX),Math.floor(t.y/this._pageScaleFactor+this._scrollOffsetY),r.Settings.instance().moduleSetting("showUAShadowDOM").get());i&&("mousemove"===e.type?(this.highlightInOverlay({node:i,selectorList:void 0},this._inspectModeConfig),this._domModel.overlayModel().nodeHighlightRequested({nodeId:i.id})):"click"===e.type&&this._domModel.overlayModel().inspectNodeRequested({backendNodeId:i.backendNodeId()}))}_handleKeyEvent(e){if(this._isGlassPaneActive())return void e.consume();const t=u.KeyboardShortcut.makeKeyFromEvent(e),i=this._shortcuts[t];i&&i(e)?e.consume():(this._inputModel&&this._inputModel.emitKeyEvent(e),e.consume(),this._canvasElement.focus())}_handleContextMenuEvent(e){e.consume(!0)}_handleBlurEvent(e){this._inputModel&&this._inputModel.cancelTouch()}_convertIntoScreenSpace(e){const t={};return t.x=Math.round(e.offsetX/this._screenZoom),t.y=Math.round(e.offsetY/this._screenZoom-this._screenOffsetTop),t}onResize(){this._deferredCasting&&(clearTimeout(this._deferredCasting),delete this._deferredCasting),this._stopCasting(),this._deferredCasting=setTimeout(this._startCasting.bind(this),100)}highlightInOverlay(e,t){this._highlightInOverlay(e,t)}async _highlightInOverlay(e,i){let s=null;if("node"in e&&(s=e.node),!s&&"deferredNode"in e&&(s=await e.deferredNode.resolvePromise()),!s&&"object"in e){const i=e.object.runtimeModel().target().model(t.DOMModel);i&&(s=await i.pushObjectAsNodeToFrontend(e.object))}if(this._highlightNode=s,this._highlightConfig=i,!s)return this._model=null,this._config=null,this._node=null,this._titleElement.classList.add("hidden"),void this._repaint();this._node=s,s.boxModel().then((e=>{e&&this._pageScaleFactor?(this._model=this._scaleModel(e),this._config=i,this._repaint()):this._repaint()}))}_scaleModel(e){function t(e){for(let t=0;t<e.length;t+=2)e[t]=e[t]*this._pageScaleFactor*this._screenZoom,e[t+1]=(e[t+1]*this._pageScaleFactor+this._screenOffsetTop)*this._screenZoom}return t.call(this,e.content),t.call(this,e.padding),t.call(this,e.border),t.call(this,e.margin),e}_repaint(){const e=this._model,t=this._config,i=this._canvasElement.getBoundingClientRect().width,s=this._canvasElement.getBoundingClientRect().height;if(this._canvasElement.width=window.devicePixelRatio*i,this._canvasElement.height=window.devicePixelRatio*s,this._context.save(),this._context.scale(window.devicePixelRatio,window.devicePixelRatio),this._context.save(),this._checkerboardPattern&&(this._context.fillStyle=this._checkerboardPattern),this._context.fillRect(0,0,i,this._screenOffsetTop*this._screenZoom),this._context.fillRect(0,this._screenOffsetTop*this._screenZoom+this._imageElement.naturalHeight*this._imageZoom,i,s),this._context.restore(),e&&t){this._context.save();const i=[],s=e=>e.a&&0===e.a;e.content&&t.contentColor&&!s(t.contentColor)&&i.push({quad:e.content,color:t.contentColor}),e.padding&&t.paddingColor&&!s(t.paddingColor)&&i.push({quad:e.padding,color:t.paddingColor}),e.border&&t.borderColor&&!s(t.borderColor)&&i.push({quad:e.border,color:t.borderColor}),e.margin&&t.marginColor&&!s(t.marginColor)&&i.push({quad:e.margin,color:t.marginColor});for(let e=i.length-1;e>0;--e)this._drawOutlinedQuadWithClip(i[e].quad,i[e-1].quad,i[e].color);i.length>0&&this._drawOutlinedQuad(i[0].quad,i[0].color),this._context.restore(),this._drawElementTitle(),this._context.globalCompositeOperation="destination-over"}this._context.drawImage(this._imageElement,0,this._screenOffsetTop*this._screenZoom,this._imageElement.naturalWidth*this._imageZoom,this._imageElement.naturalHeight*this._imageZoom),this._context.restore()}_cssColor(e){return e?h.Color.fromRGBA([e.r,e.g,e.b,void 0!==e.a?e.a:1]).asString(h.Format.RGBA)||"":"transparent"}_quadToPath(e){return this._context.beginPath(),this._context.moveTo(e[0],e[1]),this._context.lineTo(e[2],e[3]),this._context.lineTo(e[4],e[5]),this._context.lineTo(e[6],e[7]),this._context.closePath(),this._context}_drawOutlinedQuad(e,t){this._context.save(),this._context.lineWidth=2,this._quadToPath(e).clip(),this._context.fillStyle=this._cssColor(t),this._context.fill(),this._context.restore()}_drawOutlinedQuadWithClip(e,t,i){this._context.fillStyle=this._cssColor(i),this._context.save(),this._context.lineWidth=0,this._quadToPath(e).fill(),this._context.globalCompositeOperation="destination-out",this._context.fillStyle="red",this._quadToPath(t).fill(),this._context.restore()}_drawElementTitle(){if(!this._node)return;const e=this._canvasElement.getBoundingClientRect().width,t=this._canvasElement.getBoundingClientRect().height,i=this._node.localName()||this._node.nodeName().toLowerCase();this._tagNameElement.textContent=i,this._attributeElement.textContent=function(e){const t=e.getAttribute("id"),i=e.getAttribute("class");let s=t?"#"+t:"";i&&(s+="."+i.trim().replace(/\s+/g,"."));s.length>50&&(s=s.substring(0,50)+"…");return s}(this._node),this._nodeWidthElement.textContent=String(this._model?this._model.width:0),this._nodeHeightElement.textContent=String(this._model?this._model.height:0),this._titleElement.classList.remove("hidden");const s=this._titleElement.offsetWidth+6,n=this._titleElement.offsetHeight+4,o=this._model?this._model.margin[1]:0,a=this._model?this._model.margin[7]:0;let r,h=!1,l=!1,d=Math.max(2,this._model?this._model.margin[0]:0);d+s>e&&(d=e-s-2),o>t?(r=t-n-7,l=!0):a<0?(r=7,h=!0):a+n+7<t?(r=a+7-4,h=!0):o-n-7>0?(r=o-n-7+3,l=!0):r=7,this._context.save(),this._context.translate(.5,.5),this._context.beginPath(),this._context.moveTo(d,r),h&&(this._context.lineTo(d+14,r),this._context.lineTo(d+21,r-7),this._context.lineTo(d+28,r)),this._context.lineTo(d+s,r),this._context.lineTo(d+s,r+n),l&&(this._context.lineTo(d+28,r+n),this._context.lineTo(d+21,r+n+7),this._context.lineTo(d+14,r+n)),this._context.lineTo(d,r+n),this._context.closePath(),this._context.fillStyle="rgb(255, 255, 194)",this._context.fill(),this._context.strokeStyle="rgb(128, 128, 128)",this._context.stroke(),this._context.restore(),this._titleElement.style.top=r+3+"px",this._titleElement.style.left=d+3+"px"}_viewportDimensions(){const e=x;return{width:this.element.offsetWidth-e-30,height:this.element.offsetHeight-e-30-S}}setInspectMode(e,t){return this._inspectModeConfig=e!==Protocol.Overlay.InspectMode.None?t:null,Promise.resolve()}highlightFrame(e){}_createCheckerboardPattern(e){const t=document.createElement("canvas"),i=32;t.width=64,t.height=64;const s=t.getContext("2d");return s.fillStyle="rgb(195, 195, 195)",s.fillRect(0,0,64,64),s.fillStyle="rgb(225, 225, 225)",s.fillRect(0,0,i,i),s.fillRect(i,i,i,i),e.createPattern(t,"repeat")}_createNavigationBar(){this._navigationBar=this.element.createChild("div","screencast-navigation"),this._navigationBack=this._navigationBar.createChild("button","back"),this._navigationBack.disabled=!0,_.setAccessibleName(this._navigationBack,M(C.back)),this._navigationForward=this._navigationBar.createChild("button","forward"),this._navigationForward.disabled=!0,_.setAccessibleName(this._navigationForward,M(C.forward)),this._navigationReload=this._navigationBar.createChild("button","reload"),_.setAccessibleName(this._navigationReload,M(C.reload)),this._navigationUrl=g.createInput(),_.setAccessibleName(this._navigationUrl,M(C.addressBar)),this._navigationBar.appendChild(this._navigationUrl),this._navigationUrl.type="text",this._navigationProgressBar=new R(this._resourceTreeModel,this._networkManager,this._navigationBar.createChild("div","progress")),this._resourceTreeModel&&(this._navigationBack.addEventListener("click",this._navigateToHistoryEntry.bind(this,-1),!1),this._navigationForward.addEventListener("click",this._navigateToHistoryEntry.bind(this,1),!1),this._navigationReload.addEventListener("click",this._navigateReload.bind(this),!1),this._navigationUrl.addEventListener("keyup",this._navigationUrlKeyUp.bind(this),!0),this._requestNavigationHistory(),this._resourceTreeModel.addEventListener(s.Events.MainFrameNavigated,this._requestNavigationHistoryEvent,this),this._resourceTreeModel.addEventListener(s.Events.CachedResourcesLoaded,this._requestNavigationHistoryEvent,this))}_navigateToHistoryEntry(e){if(!this._resourceTreeModel)return;const t=(this._historyIndex||0)+e;!this._historyEntries||t<0||t>=this._historyEntries.length||(this._resourceTreeModel.navigateToHistoryEntry(this._historyEntries[t]),this._requestNavigationHistory())}_navigateReload(){this._resourceTreeModel&&this._resourceTreeModel.reloadPage()}_navigationUrlKeyUp(e){if("Enter"!==e.key)return;let t=this._navigationUrl.value;t&&(t.match(I)||(t="http://"+t),this._resourceTreeModel&&this._resourceTreeModel.navigate(encodeURI(decodeURI(t))),this._canvasElement.focus())}_requestNavigationHistoryEvent(e){this._requestNavigationHistory()}async _requestNavigationHistory(){const e=this._resourceTreeModel?await this._resourceTreeModel.navigationHistory():null;if(!e)return;this._historyIndex=e.currentIndex,this._historyEntries=e.entries,this._navigationBack.disabled=0===this._historyIndex,this._navigationForward.disabled=this._historyIndex===this._historyEntries.length-1;let t=this._historyEntries[this._historyIndex].url;const i=t.match(P);i&&(t=i[1]),E.InspectorFrontendHostInstance.inspectedURLChanged(t),this._navigationUrl.value=decodeURI(t)}_focusNavigationBar(){return this._navigationUrl.focus(),this._navigationUrl.select(),!0}}const x=44,S=29,P=/^http:\/\/(.+)/,I=/^(https?|about|chrome):/;class R{constructor(e,t,i){this._element=i,e&&(e.addEventListener(s.Events.MainFrameNavigated,this._onMainFrameNavigated,this),e.addEventListener(s.Events.Load,this._onLoad,this)),t&&(t.addEventListener(n.Events.RequestStarted,this._onRequestStarted,this),t.addEventListener(n.Events.RequestFinished,this._onRequestFinished,this)),this._requestIds=null,this._startedRequests=0,this._finishedRequests=0,this._maxDisplayedProgress=0}_onMainFrameNavigated(){this._requestIds=new Map,this._startedRequests=0,this._finishedRequests=0,this._maxDisplayedProgress=0,this._updateProgress(.1)}_onLoad(){this._requestIds=null,this._updateProgress(1),setTimeout((()=>{this._navigationProgressVisible()||this._displayProgress(0)}),500)}_navigationProgressVisible(){return null!==this._requestIds}_onRequestStarted(e){if(!this._navigationProgressVisible())return;const t=e.data.request;t.resourceType()!==l.resourceTypes.WebSocket&&(this._requestIds&&this._requestIds.set(t.requestId(),t),++this._startedRequests)}_onRequestFinished(e){if(!this._navigationProgressVisible())return;const t=e.data;this._requestIds&&!this._requestIds.has(t.requestId())||(++this._finishedRequests,setTimeout((()=>{this._updateProgress(this._finishedRequests/this._startedRequests*.9)}),500))}_updateProgress(e){this._navigationProgressVisible()&&(this._maxDisplayedProgress>=e||(this._maxDisplayedProgress=e,this._displayProgress(e)))}_displayProgress(e){this._element.style.width=100*e+"%"}}var k=Object.freeze({__proto__:null,UIStrings:C,ScreencastView:T,_bordersSize:x,_navBarHeight:S,_HttpRegex:P,_SchemeRegex:I,ProgressTracker:R});const q={toggleScreencast:"Toggle screencast"},O=d.registerUIStrings("screencast/ScreencastApp.js",q),B=d.getLocalizedString.bind(void 0,O);let L;class F{constructor(){this._enabledSetting=r.Settings.instance().createSetting("screencastEnabled",!0),this._toggleButton=new m.ToolbarToggle(B(q.toggleScreencast),"largeicon-phone"),this._toggleButton.setToggled(this._enabledSetting.get()),this._toggleButton.setEnabled(!1),this._toggleButton.addEventListener(m.ToolbarButton.Events.Click,this._toggleButtonClicked,this),e.TargetManager.instance().observeModels(a.ScreenCaptureModel,this)}static _instance(){return L||(L=new F),L}presentUI(e){const t=new v.RootView;this._rootSplitWidget=new p.SplitWidget(!1,!0,"InspectorView.screencastSplitViewState",300,300),this._rootSplitWidget.setVertical(!0),this._rootSplitWidget.setSecondIsSidebar(!0),this._rootSplitWidget.show(t.element),this._rootSplitWidget.hideMain(),this._rootSplitWidget.setSidebarWidget(f.InspectorView.instance()),f.InspectorView.instance().setOwnerSplit(this._rootSplitWidget),t.attachToDocument(e),t.focus()}modelAdded(e){this._screenCaptureModel||(this._screenCaptureModel=e,this._toggleButton.setEnabled(!0),this._screencastView=new T(e),this._rootSplitWidget&&this._rootSplitWidget.setMainWidget(this._screencastView),this._screencastView.initialize(),this._onScreencastEnabledChanged())}modelRemoved(e){this._screenCaptureModel===e&&(delete this._screenCaptureModel,this._toggleButton.setEnabled(!1),this._screencastView&&(this._screencastView.detach(),delete this._screencastView),this._onScreencastEnabledChanged())}_toggleButtonClicked(){const e=!this._toggleButton.toggled();this._enabledSetting.set(e),this._onScreencastEnabledChanged()}_onScreencastEnabledChanged(){if(!this._rootSplitWidget)return;const e=this._enabledSetting.get()&&this._screencastView;this._toggleButton.setToggled(e),e?this._rootSplitWidget.showBoth():this._rootSplitWidget.hideMain()}}var N=Object.freeze({__proto__:null,UIStrings:q,ScreencastApp:F,ToolbarButtonProvider:class{item(){return F._instance()._toggleButton}},ScreencastAppProvider:class{createApp(){return F._instance()}}});export{b as InputModel,N as ScreencastApp,k as ScreencastView};
