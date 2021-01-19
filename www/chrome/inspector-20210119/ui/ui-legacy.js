import{DockController as e,Context as t,ContextFlavorListener as o,ContextMenu as r,Dialog as i,EmptyWidget as n,Fragment as a,Geometry as l,GlassPane as I,InspectorView as U,ListControl as s,ListModel as g,Panel as c,SearchableView as d,SettingsUI as u,ShortcutRegistry as C,SoftContextMenu as S,SoftDropDown as m,SplitWidget as h,SuggestBox as T,SyntaxHighlighter as y,TabbedPane as p,TextEditor as D,TextPrompt as P,Toolbar as w,Tooltip as x,TreeOutline as b,UIUtils as v,View as E,ViewManager as V,Widget as L,XLink as M}from"./ui.js";self.UI=self.UI||{},UI=UI||{},UI.DockController=e.DockController,UI.DockController.State=e.State,UI.DockController.Events=e.Events,UI.DockController.ToggleDockActionDelegate=e.ToggleDockActionDelegate,UI.DockController.CloseButtonProvider=e.CloseButtonProvider,UI.Context=t.Context,UI.ContextFlavorListener=o.ContextFlavorListener,UI.ContextMenu=r.ContextMenu,UI.ContextMenu.Provider=r.Provider,UI.Dialog=i.Dialog,UI.EmptyWidget=n.EmptyWidget,UI.Fragment=a.Fragment,UI.html=a.html,UI.Geometry={},UI.Geometry.Vector=l.Vector,UI.Geometry.CubicBezier=l.CubicBezier,UI.Geometry.EulerAngles=l.EulerAngles,UI.Geometry.scalarProduct=l.scalarProduct,UI.Geometry.crossProduct=l.crossProduct,UI.Geometry.calculateAngle=l.calculateAngle,UI.Geometry.degreesToRadians=l.degreesToRadians,UI.Geometry.radiansToDegrees=l.radiansToDegrees,UI.Size=l.Size,UI.GlassPane=I.GlassPane,UI.GlassPane._panes=I.GlassPanePanes,UI.InspectorView=U.InspectorView,UI.InspectorView.ActionDelegate=U.ActionDelegate,UI.ListControl=s.ListControl,UI.ListMode=s.ListMode,UI.ListModel=g.ListModel,UI.Panel=c.Panel,UI.panels={},UI.SearchableView=d.SearchableView,UI.SearchableView.SearchConfig=d.SearchConfig,UI.Searchable=d.Searchable,UI.SettingUI=u.SettingUI,UI.ShortcutRegistry=C.ShortcutRegistry,UI.ShortcutRegistry.ForwardedShortcut=C.ForwardedShortcut,UI.SoftContextMenu=S.SoftContextMenu,UI.SoftDropDown=m.SoftDropDown,UI.SplitWidget=h.SplitWidget,UI.SuggestBox=T.SuggestBox,UI.SyntaxHighlighter=y.SyntaxHighlighter,UI.TabbedPane=p.TabbedPane,UI.TabbedPane.Events=p.Events,UI.TextEditor=D.TextEditor,UI.TextEditorFactory=D.TextEditorFactory,UI.TextPrompt=P.TextPrompt,UI.Toolbar=w.Toolbar,UI.ToolbarItem=w.ToolbarItem,UI.ToolbarItem.Provider=w.Provider,UI.Tooltip=x.Tooltip,UI.Tooltip._symbol=x.TooltipSymbol,UI.TreeOutline=b.TreeOutline,UI.TreeOutline.Events=b.Events,UI.TreeElement=b.TreeElement,UI.TreeOutlineInShadow=b.TreeOutlineInShadow,UI.Renderer=v.Renderer,UI.isBeingEdited=v.isBeingEdited,UI.isEditing=v.isEditing,UI.highlightRangesWithStyleClass=v.highlightRangesWithStyleClass,UI.applyDomChanges=v.applyDomChanges,UI.revertDomChanges=v.revertDomChanges,UI.beautifyFunctionName=v.beautifyFunctionName,UI.View=E.View,UI.SimpleView=E.SimpleView,UI.ViewLocation=E.ViewLocation,UI.ViewLocationResolver=E.ViewLocationResolver,UI.ViewManager=V.ViewManager,UI.ViewManager._ContainerWidget=V.ContainerWidget,UI.Widget=L.Widget,UI.XLink=M.XLink,UI.XLink.ContextMenuProvider=M.ContextMenuProvider,self.UI.context=t.Context.instance(),UI.dockController;
