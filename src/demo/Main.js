import CssQuad from "lib/CssQuad";
import { debounce } from "debounce";

class Main
{
	constructor()
	{
		document.addEventListener("DOMContentLoaded", this._onDomContentLoaded);
	}

	@autobind
	_onDomContentLoaded()
	{
		document.removeEventListener("DOMContentLoaded", this._onDomContentLoaded);

		this._mx = 0;
		this._my = 0;

		this._cssQuad = new CssQuad(document.querySelector('.quad'));
		this._quadHandles = document.querySelectorAll('.handle');
		for (let i = 0, li = this._quadHandles.length; i < li; i++)
		{
			const p = this._cssQuad["p" + (i + 1)];
			const element = this._quadHandles[i];
			element.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
			element.__index = i;
			element.addEventListener('mousedown', this._onHandleDown);
		}
		window.addEventListener("mousemove", this._onHandleMove);
		window.addEventListener("mouseup", this._onHandleUp);

		window.addEventListener("resize", debounce(this._onResize, 100));

		this._update();
	}

	@autobind
	_onHandleDown(e)
	{
		this._currentHandle = e.currentTarget;
	}
	
	@autobind
	_onHandleUp(e)
	{
		this._currentHandle = null;
	}

	@autobind
	_onHandleMove(e)
	{
		this._mx = e.clientX;
		this._my = e.clientY;
	}

	@autobind
	_update()
	{
		if(this._currentHandle)
		{
			this._currentHandle.style.transform = `translate3d(${this._mx}px, ${this._my}px, 0)`;
			this._cssQuad['p' + (this._currentHandle.__index + 1)] = {x: this._mx, y: this._my};
		}

		this._cssQuad.update();
		
		window.requestAnimationFrame(this._update);
	}
	
	//-----------------------------------------------------o handlers
	
	@autobind
	_onResize()
	{
		this._cssQuad.resize();
	}
}

new Main();