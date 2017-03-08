interface IClockState {
    time: string;
}

class Clock extends ajs.mvvm.viewmodel.ViewComponent {

    public time: string;

    public setState(state: IClockState): void {
        super.setState(state);
    }
}

class UserComponent extends ajs.mvvm.viewmodel.ViewComponent {

    protected _timer: number;
    protected _lastContent: string;
    protected _counter: number;

    public clock: Clock;

    protected _initialize(): void {

        this._counter = 0;
        this._lastContent = "";

        this._timer = setTimeout(() => { this._updateView(); }, 1000);
    }

    protected _finalize(): void {
        clearTimeout(this._timer);
    }

    protected _updateView(): void {

        switch (this._counter) {
            case 0:
                let time: Date = new Date();
                this._setupContentViewComponent("clock");
                this.clock.setState({ time: time.toLocaleTimeString() });
                break;
            case 1:
                this._setupContentViewComponent("image");
                break;
        }


        this._counter++;
        if (this._counter > 1) {
            this._counter = 0;
        }
    }

    protected _setupContentViewComponent(componentName: string): void {

        if (componentName !== this._lastContent) {

            if (this._lastContent !== "") {
                // this.removeChildComponent("content", this._lastContent);
            }

            // this.insertChildComponent(componentName, componentName, null, "content");
            this._lastContent = componentName;
        }

    }

}
