/**
	 * @class Common utilities
	 * @name glMatrix
	 */
 var glMatrix = {};

 // Configuration Constants
 glMatrix.EPSILON = 0.000001;
 glMatrix.ARRAY_TYPE = (typeof Float32Array !== 'undefined') ? Float32Array : Array;
 glMatrix.RANDOM = Math.random;
 glMatrix.ENABLE_SIMD = false;
 
 // Capability detection
 glMatrix.SIMD_AVAILABLE = (glMatrix.ARRAY_TYPE === Float32Array) && ('SIMD' in this);
 glMatrix.USE_SIMD = glMatrix.ENABLE_SIMD && glMatrix.SIMD_AVAILABLE;
 
 /**
	 * Convert Degree To Radian
	 *
	 * @param {Number} Angle in Degrees
	 */
 const degree = Math.PI / 180;
 glMatrix.toRadian = function (a) {
	 return a * degree;
 }
 
 mat4 = {
	 scalar: {},
	 SIMD: {}
 };
 vec3 = {};
 /**
	  * Set a mat4 to the identity matrix
	  *
	  * @param {mat4} out the receiving matrix
	  * @returns {mat4} out
	  */
 mat4.identity = function (out) {
	 out[0] = 1;
	 out[1] = 0;
	 out[2] = 0;
	 out[3] = 0;
	 out[4] = 0;
	 out[5] = 1;
	 out[6] = 0;
	 out[7] = 0;
	 out[8] = 0;
	 out[9] = 0;
	 out[10] = 1;
	 out[11] = 0;
	 out[12] = 0;
	 out[13] = 0;
	 out[14] = 0;
	 out[15] = 1;
	 return out;
 };
 
 /**
	  * Generates a look-at matrix with the given eye position, focal point, and up axis
	  *
	  * @param {mat4} out mat4 frustum matrix will be written into
	  * @param {vec3} eye Position of the viewer
	  * @param {vec3} center Point the viewer is looking at
	  * @param {vec3} up vec3 pointing up
	  * @returns {mat4} out
	  */
 mat4.lookAt = function (out, eye, center, up) {
	 var x0, x1, x2, y0, y1, y2, z0, z1, z2, len,
		 eyex = eye[0],
		 eyey = eye[1],
		 eyez = eye[2],
		 upx = up[0],
		 upy = up[1],
		 upz = up[2],
		 centerx = center[0],
		 centery = center[1],
		 centerz = center[2];
 
	 if (Math.abs(eyex - centerx) < glMatrix.EPSILON &&
		 Math.abs(eyey - centery) < glMatrix.EPSILON &&
		 Math.abs(eyez - centerz) < glMatrix.EPSILON) {
		 return mat4.identity(out);
	 }
 
	 z0 = eyex - centerx;
	 z1 = eyey - centery;
	 z2 = eyez - centerz;
 
	 len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
	 z0 *= len;
	 z1 *= len;
	 z2 *= len;
 
	 x0 = upy * z2 - upz * z1;
	 x1 = upz * z0 - upx * z2;
	 x2 = upx * z1 - upy * z0;
	 len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
	 if (!len) {
		 x0 = 0;
		 x1 = 0;
		 x2 = 0;
	 } else {
		 len = 1 / len;
		 x0 *= len;
		 x1 *= len;
		 x2 *= len;
	 }
 
	 y0 = z1 * x2 - z2 * x1;
	 y1 = z2 * x0 - z0 * x2;
	 y2 = z0 * x1 - z1 * x0;
 
	 len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
	 if (!len) {
		 y0 = 0;
		 y1 = 0;
		 y2 = 0;
	 } else {
		 len = 1 / len;
		 y0 *= len;
		 y1 *= len;
		 y2 *= len;
	 }
 
	 out[0] = x0;
	 out[1] = y0;
	 out[2] = z0;
	 out[3] = 0;
	 out[4] = x1;
	 out[5] = y1;
	 out[6] = z1;
	 out[7] = 0;
	 out[8] = x2;
	 out[9] = y2;
	 out[10] = z2;
	 out[11] = 0;
	 out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
	 out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
	 out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
	 out[15] = 1;
 
	 return out;
 };
 
 /**
  * Generates a perspective projection matrix with the given bounds
  *
  * @param {mat4} out mat4 frustum matrix will be written into
  * @param {number} fovy Vertical field of view in radians
  * @param {number} aspect Aspect ratio. typically viewport width/height
  * @param {number} near Near bound of the frustum
  * @param {number} far Far bound of the frustum
  * @returns {mat4} out
  */
 mat4.perspective = function (out, fovy, aspect, near, far) {
	 var f = 1.0 / Math.tan(fovy / 2),
		 nf = 1 / (near - far);
	 out[0] = f / aspect;
	 out[1] = 0;
	 out[2] = 0;
	 out[3] = 0;
	 out[4] = 0;
	 out[5] = f;
	 out[6] = 0;
	 out[7] = 0;
	 out[8] = 0;
	 out[9] = 0;
	 out[10] = (far + near) * nf;
	 out[11] = -1;
	 out[12] = 0;
	 out[13] = 0;
	 out[14] = (2 * far * near) * nf;
	 out[15] = 0;
	 return out;
 };
 
 /**
	  * Rotates a mat4 by the given angle around the given axis
	  *
	  * @param {mat4} out the receiving matrix
	  * @param {mat4} a the matrix to rotate
	  * @param {Number} rad the angle to rotate the matrix by
	  * @param {vec3} axis the axis to rotate around
	  * @returns {mat4} out
	  */
 mat4.rotate = function (out, a, rad, axis) {
	 var x = axis[0], y = axis[1], z = axis[2],
		 len = Math.sqrt(x * x + y * y + z * z),
		 s, c, t,
		 a00, a01, a02, a03,
		 a10, a11, a12, a13,
		 a20, a21, a22, a23,
		 b00, b01, b02,
		 b10, b11, b12,
		 b20, b21, b22;
 
	 if (Math.abs(len) < glMatrix.EPSILON) { return null; }
 
	 len = 1 / len;
	 x *= len;
	 y *= len;
	 z *= len;
 
	 s = Math.sin(rad);
	 c = Math.cos(rad);
	 t = 1 - c;
 
	 a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3];
	 a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7];
	 a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11];
 
	 // Construct the elements of the rotation matrix
	 b00 = x * x * t + c; b01 = y * x * t + z * s; b02 = z * x * t - y * s;
	 b10 = x * y * t - z * s; b11 = y * y * t + c; b12 = z * y * t + x * s;
	 b20 = x * z * t + y * s; b21 = y * z * t - x * s; b22 = z * z * t + c;
 
	 // Perform rotation-specific matrix multiplication
	 out[0] = a00 * b00 + a10 * b01 + a20 * b02;
	 out[1] = a01 * b00 + a11 * b01 + a21 * b02;
	 out[2] = a02 * b00 + a12 * b01 + a22 * b02;
	 out[3] = a03 * b00 + a13 * b01 + a23 * b02;
	 out[4] = a00 * b10 + a10 * b11 + a20 * b12;
	 out[5] = a01 * b10 + a11 * b11 + a21 * b12;
	 out[6] = a02 * b10 + a12 * b11 + a22 * b12;
	 out[7] = a03 * b10 + a13 * b11 + a23 * b12;
	 out[8] = a00 * b20 + a10 * b21 + a20 * b22;
	 out[9] = a01 * b20 + a11 * b21 + a21 * b22;
	 out[10] = a02 * b20 + a12 * b21 + a22 * b22;
	 out[11] = a03 * b20 + a13 * b21 + a23 * b22;
 
	 if (a !== out) { // If the source and destination differ, copy the unchanged last row
		 out[12] = a[12];
		 out[13] = a[13];
		 out[14] = a[14];
		 out[15] = a[15];
	 }
	 return out;
 };


mat4.translation = function(tx, ty, tz, dst) {
    dst = dst || new MatType(16);

    dst[ 0] = 1;
    dst[ 1] = 0;
    dst[ 2] = 0;
    dst[ 3] = 0;
    dst[ 4] = 0;
    dst[ 5] = 1;
    dst[ 6] = 0;
    dst[ 7] = 0;
    dst[ 8] = 0;
    dst[ 9] = 0;
    dst[10] = 1;
    dst[11] = 0;
    dst[12] = tx;
    dst[13] = ty;
    dst[14] = tz;
    dst[15] = 1;

    return dst;
}

/**
   * Multiply by an z rotation matrix
   * @param {Matrix4} m matrix to multiply
   * @param {number} angleInRadians amount to rotate
   * @param {Matrix4} [dst] optional matrix to store result
   * @return {Matrix4} dst or a new matrix if none provided
   * @memberOf module:webgl-3d-math
*/
mat4.zRotate = function(m, angleInRadians, dst) {
    // This is the optimized version of
    // return multiply(m, zRotation(angleInRadians), dst);
    dst = dst || new MatType(16);

    var m00 = m[0 * 4 + 0];
    var m01 = m[0 * 4 + 1];
    var m02 = m[0 * 4 + 2];
    var m03 = m[0 * 4 + 3];
    var m10 = m[1 * 4 + 0];
    var m11 = m[1 * 4 + 1];
    var m12 = m[1 * 4 + 2];
    var m13 = m[1 * 4 + 3];
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);

    dst[ 0] = c * m00 + s * m10;
    dst[ 1] = c * m01 + s * m11;
    dst[ 2] = c * m02 + s * m12;
    dst[ 3] = c * m03 + s * m13;
    dst[ 4] = c * m10 - s * m00;
    dst[ 5] = c * m11 - s * m01;
    dst[ 6] = c * m12 - s * m02;
    dst[ 7] = c * m13 - s * m03;

    if (m !== dst) {
      dst[ 8] = m[ 8];
      dst[ 9] = m[ 9];
      dst[10] = m[10];
      dst[11] = m[11];
      dst[12] = m[12];
      dst[13] = m[13];
      dst[14] = m[14];
      dst[15] = m[15];
    }

    return dst;
  }

/**
   * Multiply by an x rotation matrix
   * @param {Matrix4} m matrix to multiply
   * @param {number} angleInRadians amount to rotate
   * @param {Matrix4} [dst] optional matrix to store result
   * @return {Matrix4} dst or a new matrix if none provided
   * @memberOf module:webgl-3d-math
*/
mat4.xRotate = function(m, angleInRadians, dst) {
    // this is the optimized version of
    // return multiply(m, xRotation(angleInRadians), dst);
    dst = dst || new MatType(16);

    var m10 = m[4];
    var m11 = m[5];
    var m12 = m[6];
    var m13 = m[7];
    var m20 = m[8];
    var m21 = m[9];
    var m22 = m[10];
    var m23 = m[11];
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);

    dst[4]  = c * m10 + s * m20;
    dst[5]  = c * m11 + s * m21;
    dst[6]  = c * m12 + s * m22;
    dst[7]  = c * m13 + s * m23;
    dst[8]  = c * m20 - s * m10;
    dst[9]  = c * m21 - s * m11;
    dst[10] = c * m22 - s * m12;
    dst[11] = c * m23 - s * m13;

    if (m !== dst) {
      dst[ 0] = m[ 0];
      dst[ 1] = m[ 1];
      dst[ 2] = m[ 2];
      dst[ 3] = m[ 3];
      dst[12] = m[12];
      dst[13] = m[13];
      dst[14] = m[14];
      dst[15] = m[15];
    }

    return dst;
}

/**
   * Multiply by an y rotation matrix
   * @param {Matrix4} m matrix to multiply
   * @param {number} angleInRadians amount to rotate
   * @param {Matrix4} [dst] optional matrix to store result
   * @return {Matrix4} dst or a new matrix if none provided
   * @memberOf module:webgl-3d-math
*/
mat4.yRotate = function(m, angleInRadians, dst) {
    // this is the optimized version of
    // return multiply(m, yRotation(angleInRadians), dst);
    dst = dst || new MatType(16);

    var m00 = m[0 * 4 + 0];
    var m01 = m[0 * 4 + 1];
    var m02 = m[0 * 4 + 2];
    var m03 = m[0 * 4 + 3];
    var m20 = m[2 * 4 + 0];
    var m21 = m[2 * 4 + 1];
    var m22 = m[2 * 4 + 2];
    var m23 = m[2 * 4 + 3];
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);

    dst[ 0] = c * m00 - s * m20;
    dst[ 1] = c * m01 - s * m21;
    dst[ 2] = c * m02 - s * m22;
    dst[ 3] = c * m03 - s * m23;
    dst[ 8] = c * m20 + s * m00;
    dst[ 9] = c * m21 + s * m01;
    dst[10] = c * m22 + s * m02;
    dst[11] = c * m23 + s * m03;

    if (m !== dst) {
      dst[ 4] = m[ 4];
      dst[ 5] = m[ 5];
      dst[ 6] = m[ 6];
      dst[ 7] = m[ 7];
      dst[12] = m[12];
      dst[13] = m[13];
      dst[14] = m[14];
      dst[15] = m[15];
    }

    return dst;
}

/**
   * Multiply by a scaling matrix
   * @param {Matrix4} m matrix to multiply
   * @param {number} sx x scale.
   * @param {number} sy y scale.
   * @param {number} sz z scale.
   * @param {Matrix4} [dst] optional matrix to store result
   * @return {Matrix4} dst or a new matrix if none provided
   * @memberOf module:webgl-3d-math
   */
mat4.scale = function(m, sx, sy, sz, dst) {
    // This is the optimized version of
    // return multiply(m, scaling(sx, sy, sz), dst);
    dst = dst || new MatType(16);

    dst[ 0] = sx * m[0 * 4 + 0];
    dst[ 1] = sx * m[0 * 4 + 1];
    dst[ 2] = sx * m[0 * 4 + 2];
    dst[ 3] = sx * m[0 * 4 + 3];
    dst[ 4] = sy * m[1 * 4 + 0];
    dst[ 5] = sy * m[1 * 4 + 1];
    dst[ 6] = sy * m[1 * 4 + 2];
    dst[ 7] = sy * m[1 * 4 + 3];
    dst[ 8] = sz * m[2 * 4 + 0];
    dst[ 9] = sz * m[2 * 4 + 1];
    dst[10] = sz * m[2 * 4 + 2];
    dst[11] = sz * m[2 * 4 + 3];

    if (m !== dst) {
      dst[12] = m[12];
      dst[13] = m[13];
      dst[14] = m[14];
      dst[15] = m[15];
    }

    return dst;
}
 
 /**
	  * Multiplies two mat4's explicitly using SIMD
	  *
	  * @param {mat4} out the receiving matrix
	  * @param {mat4} a the first operand, must be a Float32Array
	  * @param {mat4} b the second operand, must be a Float32Array
	  * @returns {mat4} out
	  */
 mat4.SIMD.multiply = function (out, a, b) {
	 var a0 = SIMD.Float32x4.load(a, 0);
	 var a1 = SIMD.Float32x4.load(a, 4);
	 var a2 = SIMD.Float32x4.load(a, 8);
	 var a3 = SIMD.Float32x4.load(a, 12);
 
	 var b0 = SIMD.Float32x4.load(b, 0);
	 var out0 = SIMD.Float32x4.add(
		 SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b0, 0, 0, 0, 0), a0),
		 SIMD.Float32x4.add(
			 SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b0, 1, 1, 1, 1), a1),
			 SIMD.Float32x4.add(
				 SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b0, 2, 2, 2, 2), a2),
				 SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b0, 3, 3, 3, 3), a3))));
	 SIMD.Float32x4.store(out, 0, out0);
 
	 var b1 = SIMD.Float32x4.load(b, 4);
	 var out1 = SIMD.Float32x4.add(
		 SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b1, 0, 0, 0, 0), a0),
		 SIMD.Float32x4.add(
			 SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b1, 1, 1, 1, 1), a1),
			 SIMD.Float32x4.add(
				 SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b1, 2, 2, 2, 2), a2),
				 SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b1, 3, 3, 3, 3), a3))));
	 SIMD.Float32x4.store(out, 4, out1);
 
	 var b2 = SIMD.Float32x4.load(b, 8);
	 var out2 = SIMD.Float32x4.add(
		 SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b2, 0, 0, 0, 0), a0),
		 SIMD.Float32x4.add(
			 SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b2, 1, 1, 1, 1), a1),
			 SIMD.Float32x4.add(
				 SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b2, 2, 2, 2, 2), a2),
				 SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b2, 3, 3, 3, 3), a3))));
	 SIMD.Float32x4.store(out, 8, out2);
 
	 var b3 = SIMD.Float32x4.load(b, 12);
	 var out3 = SIMD.Float32x4.add(
		 SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b3, 0, 0, 0, 0), a0),
		 SIMD.Float32x4.add(
			 SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b3, 1, 1, 1, 1), a1),
			 SIMD.Float32x4.add(
				 SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b3, 2, 2, 2, 2), a2),
				 SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b3, 3, 3, 3, 3), a3))));
	 SIMD.Float32x4.store(out, 12, out3);
 
	 return out;
 };
 
 /**
  * Multiplies two mat4's explicitly not using SIMD
  *
  * @param {mat4} out the receiving matrix
  * @param {mat4} a the first operand
  * @param {mat4} b the second operand
  * @returns {mat4} out
  */
 mat4.scalar.multiply = function (out, a, b) {
	 var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
		 a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
		 a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
		 a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
 
	 // Cache only the current line of the second matrix
	 var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
	 out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
	 out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
	 out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
	 out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
 
	 b0 = b[4]; b1 = b[5]; b2 = b[6]; b3 = b[7];
	 out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
	 out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
	 out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
	 out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
 
	 b0 = b[8]; b1 = b[9]; b2 = b[10]; b3 = b[11];
	 out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
	 out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
	 out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
	 out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
 
	 b0 = b[12]; b1 = b[13]; b2 = b[14]; b3 = b[15];
	 out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
	 out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
	 out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
	 out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
	 return out;
 };
 
 /**
  * Multiplies two mat4's using SIMD if available and enabled
  *
  * @param {mat4} out the receiving matrix
  * @param {mat4} a the first operand
  * @param {mat4} b the second operand
  * @returns {mat4} out
  */
 mat4.multiply = glMatrix.USE_SIMD ? mat4.SIMD.multiply : mat4.scalar.multiply;
 mat4.mul = mat4.multiply;
 
 
 
 /**
	  * Computes the cross product of two vec3's
	  *
	  * @param {vec3} out the receiving vector
	  * @param {vec3} a the first operand
	  * @param {vec3} b the second operand
	  * @returns {vec3} out
	  */
 vec3.cross = function (a, b) {
	 var ax = a[0], ay = a[1], az = a[2],
		 bx = b[0], by = b[1], bz = b[2];
 
	 return [ay * bz - az * by, az * bx - ax * bz, ax * by - ay * bx];
 };
 
 /**
	  * Normalize a vec3
	  *
	  * @param {vec3} out the receiving vector
	  * @param {vec3} a vector to normalize
	  * @returns {vec3} out
	  */
 vec3.normalize = function (a) {
	 var x = a[0],
		 y = a[1],
		 z = a[2];
	 var len = x * x + y * y + z * z;
	 if (len > 0) {
		 //TODO: evaluate use of glm_invsqrt here?
		 len = 1 / Math.sqrt(len);
	 }
	 return [a[0] * len, a[1] * len, a[2] * len];
 };
 
 vec3.add = function (a, b) {
	 return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
 }
 vec3.subtract = function (a, b) {
	 return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
 }
 vec3.multiply = function (a, b) {
	 return [a[0] * b[0], a[1] * b[1], a[2] * b[2]];
 }
 vec3.multiplyInt = function (a, b) {
	 return [a * b[0], a * b[1], a * b[2]];
 }
 
 function radians(degrees) {
	 var pi = Math.PI;
	 return degrees * (pi / 180);
 }