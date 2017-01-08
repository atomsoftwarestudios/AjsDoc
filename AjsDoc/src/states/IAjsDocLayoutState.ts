namespace ajsdoc {

    "use strict";

    export interface IAjsDocLayoutState extends ajs.mvvm.viewmodel.ViewComponent {
        ajsDocHeader: ajs.mvvm.viewmodel.ViewComponent;
        ajsDocMenu: ajs.mvvm.viewmodel.ViewComponent;
        ajsDocNavBar: ajs.mvvm.viewmodel.ViewComponent;
        ajsDocArticle: AjsDocArticle;
    }

}

