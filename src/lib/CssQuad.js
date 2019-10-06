/**
 * Css quad
 * Original post https://math.stackexchange.com/questions/296794/finding-the-transform-matrix-from-4-projected-points-with-javascript/339033
 * @author Léo Chéron
 */
export default class CssQuad 
{
	constructor(dom) 
	{
		this.dom = dom;

		this.resize();

		this._p1 = {x: this._x, y: this._y}
		this._p2 = {x: this._x + this._w, y: this._y}
		this._p3 = {x: this._x + this._w, y: this._y + this._h}
		this._p4 = {x: this._x, y: this._y + this._h};
		this.needsUpdate = true;	
	}

	resize()
	{
		this._x = this._y = 0;
		let element = this.dom;
		while(element) 
		{
			this._x += element.offsetLeft;
			this._y += element.offsetTop;
			element = element.offsetParent;
		}

		this._w = this.dom.offsetWidth;
		this._h = this.dom.offsetHeight;
	}

	update() 
	{
		if(this.needsUpdate)
		{
			let t = this._general2DProjection(0, 0, 
				this._p1.x - this._x, this._p1.y - this._y, this._w, 0, 
				this._p2.x - this._x, this._p2.y - this._y, 0, this._h, 
				this._p4.x - this._x, this._p4.y - this._y, this._w, this._h, 
				this._p3.x - this._x, this._p3.y - this._y);
			for (let i = 0; i != 9; ++i) t[i] = t[i] / t[8];
			t = [
				t[0], t[3], 0, t[6],
				t[1], t[4], 0, t[7],
				0, 0, 1, 0,
				t[2], t[5], 0, t[8]
			];

			this.dom.style.transform = `matrix3d(${t.join(",")})`;

			this.needsUpdate = false;
		}
	}

	//-----------------------------------------------------o getters & setters

	/**
	 * @param {x, y} value
	 */
	set p1(value)
	{
		this._p1 = value;
		this.needsUpdate = true;
	}

	get p1()
	{
		return this._p1;
	}

	/**
	 * @param {x, y} value
	 */
	set p2(value)
	{
		this._p2 = value;
		this.needsUpdate = true;
	}

	get p2()
	{
		return this._p2;
	}

	/**
	 * @param {x, y} value
	 */
	set p3(value)
	{
		this._p3 = value;
		this.needsUpdate = true;
	}

	get p3()
	{
		return this._p3;
	}

	/**
	 * @param {x, y} value
	 */
	set p4(value)
	{
		this._p4 = value;
		this.needsUpdate = true;
	}
	
	get p4()
	{
		return this._p4;
	}

	//-----------------------------------------------------o private

	/**
	 * Compute the adjugate of m
	 * @param {*} m 
	 */
	_adj(m) 
	{
		return [
			m[4] * m[8] - m[5] * m[7], m[2] * m[7] - m[1] * m[8], m[1] * m[5] - m[2] * m[4],
			m[5] * m[6] - m[3] * m[8], m[0] * m[8] - m[2] * m[6], m[2] * m[3] - m[0] * m[5],
			m[3] * m[7] - m[4] * m[6], m[1] * m[6] - m[0] * m[7], m[0] * m[4] - m[1] * m[3]
		];
	}

	/**
	 * multiply two matrices
	 * @param {*} a 
	 * @param {*} b 
	 */
	_multmm(a, b) 
	{
		const c = Array(9);
		for (let i = 0; i != 3; ++i) 
		{
			for (let j = 0; j != 3; ++j) 
			{
				let cij = 0;
				for (let k = 0; k != 3; ++k) 
				{
					cij += a[3 * i + k] * b[3 * k + j];
				}
				c[3 * i + j] = cij;
			}
		}
		return c;
	}

	/**
	 * multiply matrix and vector
	 * @param {*} m 
	 * @param {*} v 
	 */
	_multmv(m, v) 
	{
		return [
			m[0] * v[0] + m[1] * v[1] + m[2] * v[2],
			m[3] * v[0] + m[4] * v[1] + m[5] * v[2],
			m[6] * v[0] + m[7] * v[1] + m[8] * v[2]
		];
	}

	_pdbg(m, v) 
	{
		const r = this._multmv(m, v);
		return r + " (" + r[0] / r[2] + ", " + r[1] / r[2] + ")";
	}

	_basisToPoints(x1, y1, x2, y2, x3, y3, x4, y4) 
	{
		const m = [
			x1, x2, x3,
			y1, y2, y3,
			1, 1, 1
		];

		const v = this._multmv(this._adj(m), [x4, y4, 1]);

		return this._multmm(m, [
			v[0], 0, 0,
			0, v[1], 0,
			0, 0, v[2]
		]);
	}

	_general2DProjection(
		x1s, y1s, x1d, y1d,
		x2s, y2s, x2d, y2d,
		x3s, y3s, x3d, y3d,
		x4s, y4s, x4d, y4d
	) 
	{
		const s = this._basisToPoints(x1s, y1s, x2s, y2s, x3s, y3s, x4s, y4s);
		const d = this._basisToPoints(x1d, y1d, x2d, y2d, x3d, y3d, x4d, y4d);

		return this._multmm(d, this._adj(s));
	}
}