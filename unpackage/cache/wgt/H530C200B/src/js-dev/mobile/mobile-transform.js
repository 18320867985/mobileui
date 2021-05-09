/*
 hqs-transform
*/

+function (m) {

    function getTransformArrayByCss($this) {
        var transformText = m($this).css("transform");
        if (!transformText) {
            transformText = m($this).css("-webkit-transform");
        }
        transformText = m.trim(transformText);
        //console.log(transformText)
        var reg = /\((.*)\)$/img;
        var bl = reg.test(transformText), arrs = [];
        if (bl) {
            var txts = RegExp.$1.split(",") || [];
            txts.forEach(item => {
                arrs.push(parseFloat(item.trim()));
            });

        }

        return arrs;
    }

    // getDeg
    function getDeg(transformArrs, a, b, c, d) {

        var len = transformArrs.length, deg = 0, aa = 0, bb = 0, cc = 0, dd = 0;

        if (len === 6) {
            aa = Math.round(180 * Math.asin(transformArrs[a]) / Math.PI);
            bb = Math.round(180 * Math.acos(transformArrs[b]) / Math.PI);
            cc = Math.round(180 * Math.asin(transformArrs[c]) / Math.PI);
            dd = Math.round(180 * Math.acos(transformArrs[d]) / Math.PI);

        } else {
            aa = Math.round(180 * Math.asin(transformArrs[a]) / Math.PI);
            bb = Math.round(180 * Math.acos(transformArrs[b]) / Math.PI);
            cc = Math.round(180 * Math.asin(transformArrs[c]) / Math.PI);
            dd = Math.round(180 * Math.acos(transformArrs[d]) / Math.PI);


        }

        if (aa === bb || -aa === bb) {
            deg = dd;
        } else if (-aa + bb === 180) {
            deg = 180 + cc;
        } else if (aa + bb === 180) {
            deg = 360 - cc || 360 - dd;
        }

        return deg >= 360 ? 0 : deg;

    }

    // setTransform 
    function setTransform(transforName, value, value2) {

        // 参数为3个
        if (arguments.length === 3) {
            var vals = [value];
            vals.push(value2);
            value = vals;
        }

        m.each(this, function () {
            if (!this.transform) {
                this.transform = {};
            }

            this.transform[transforName] = value;
            var result = '';
            var arrs = [];
            for (var item in this.transform) {
                switch (item) {
                    case 'rotate':
                    case 'rotateX':
                    case 'rotateY':
                    case 'rotateZ':
                    case 'skewX':
                    case 'skewY':
                    case 'skewZ':
                        result += item + '(' + parseFloat(this.transform[item]) + 'deg)  ';
                        break;
                    case 'skew':

                         arrs = this.transform[item]||[];
                        if (arrs.length === 2) {
                            result += item + '(' + parseFloat(arrs[0]) + 'deg,' + parseFloat(arrs[1]) + 'deg)  ';
                        } else {
                            result += item + '(' + parseFloat(arrs) + 'deg,' + parseFloat(arrs) + 'deg)  ';
                        }
                        break;

                    case 'scaleX':
                    case 'scaleY':
                    case 'scaleZ':
                        result += item + '(' + parseFloat(this.transform[item]) + ')  ';
                        break;

                    case 'scale':
                         arrs = this.transform[item]||[];

                        if (arrs.length === 2) {
                            result += item + '(' + parseFloat(arrs[0]) + ',' + parseFloat(arrs[1]) + ')  ';
                        } else {
                            result += item + '(' + parseFloat(arrs) + ',' + parseFloat(arrs) + ')  ';
                        }
                        break;

                    case 'translateX':
                    case 'translateY':
                    case 'translateZ':
                        result += item + '(' + parseFloat(this.transform[item]) + 'px)  ';
                        break;
                    case 'translate':
                         arrs = this.transform[item]||[];

                        if (arrs.length === 2) {
                            result += item + '(' + parseFloat(arrs[0]) + 'px,' + parseFloat(arrs[1]) + 'px)  ';
                        } else {
                            result += item + '(' + parseFloat(arrs) + 'px,' + parseFloat(arrs) + 'px)  ';
                        }
                        break;

                }

            }

            this.style.WebkitTransform = result;
            this.style.MozTransform = result;
            this.style.msTransform = result;
            this.style.OTransform = result;
            this.style.transform = result;

            //this.style.cssText+="transform:"+result;


        });

        return this;
    }

    // getTransform  by css
    function getTransformByCss(transforName) {

        var result;
        Mobile.each(this, function () {
            var transformArrs = getTransformArrayByCss(this);
           // console.log(transformArrs)
            var len = transformArrs.length;
            switch (transforName) {

                case 'rotate':
                case 'rotateX':
                case 'rotateY':
                case 'rotateZ':

                    if (transforName === "rotate") {

                        if (transformArrs.length === 0) {
                            result = 0;
                        } else {

                            result = getDeg(transformArrs, 0, 1, 2, 3);

                        }

                    }

                    if (transforName === "rotateX") {
                        if (transformArrs.length === 0) {
                            result = 0;
                        } else {
                            result = getDeg(transformArrs, 5, 6, 9, 10);

                            // if(transformArrs[6]<0){
                            //     result=-(360-result);
                            // }

                        }

                    }

                    if (transforName === "rotateY") {
                        if (transformArrs.length === 0) {
                            result = 0;
                        } else {
                            result = getDeg(transformArrs, 0, 2, 8, 10);

                            // if(transformArrs[8]<0){
                            //     result=-(360-result);
                            // }
                        }

                    }

                    break;

                // case 'skew':
                // case 'skewX':
                // case 'skewY':
                // case 'skewZ':

                //     if (transforName === "skew") {
                      
                //         if (transformArrs.length === 0) {
                //             result = 0;
                //         } else {

                //             result = getDeg(transformArrs, 0, 1, 2, 3);

                //         }

                //     }

                //     if (transforName === "skewX") {
                //         if (transformArrs.length === 0) {
                //             result = 0;
                //         } else {
                //             result = getDeg(transformArrs, 5, 6, 9, 10);

                //             // if(transformArrs[6]<0){
                //             //     result=-(360-result);
                //             // }

                //         }

                //     }

                //     if (transforName === "skewY") {
                //         if (transformArrs.length === 0) {
                //             result = 0;
                //         } else {
                //             result = getDeg(transformArrs, 0, 2, 8, 10);

                //             // if(transformArrs[8]<0){
                //             //     result=-(360-result);
                //             // }
                //         }

                //     }

                //     break;


                case 'translate':
                case 'translateX':
                case 'translateY':
                case 'translateZ':

                    if (transforName === "translate") {
                        if (len === 0) {
                            result = [0, 0];
                        } else {
                            result = len === 6 ? [transformArrs[4], transformArrs[5]] : [transformArrs[12], transformArrs[13]]
                        }

                    }
                    if (transforName === "translateX") {
                        if (len === 0) {
                            result = 0;
                        } else {
                            result = len === 6 ? transformArrs[4] : transformArrs[12];
                        }

                    }

                    if (transforName === "translateY") {
                        if (len === 0) {
                            result = 0;
                        } else {
                            result = len === 6 ? transformArrs[5] : transformArrs[13];
                        }

                    }
                    if (transforName === "translateZ") {
                        if (len === 0) {
                            result = 0;
                        } else {
                            result = len === 16 ? transformArrs[14] : 0;
                        }

                    }

                    break;

                case 'scale':
                case 'scaleX':
                case 'scaleY':
                case 'scaleZ':

                    if (transforName === "scale") {
                        if (len === 0) {
                            result = [1, 1];
                        } else {
                            result = len === 6 ? [transformArrs[0], transformArrs[3]] : [transformArrs[0], transformArrs[5]]
                        }

                    }
                    if (transforName === "scaleX") {
                        if (len === 0) {
                            result = 1;
                        } else {
                            result = transformArrs[0];
                        }

                    }

                    if (transforName === "scaleY") {
                        if (len === 0) {
                            result = 1;
                        } else {
                            result = len === 6 ? transformArrs[3] : transformArrs[5];
                        }

                    }

                    break;
            }

            return false;
        });

        return result;
    };

    // transform 
    m.fn.extend({

        // translate
        translate: function () {

            if (arguments.length === 0) {
                var _v = 0;
                Mobile.each(this, function () {
                    _v = getTransformByCss.call(m(this), "translate");
                    return false;
                });

                return _v;

            } else {
                if (arguments.length === 1) {
                    setTransform.call(this, "translate", arguments[0]);
                }
                if (arguments.length === 2) {
                    setTransform.call(this, "translate", arguments[0], arguments[1]);
                }

                return this;
            }

        },

        // translateX
        translateX: function (size) {
            if (arguments.length === 0) {

                var _v = 0;
                Mobile.each(this, function () {
                    _v = getTransformByCss.call(m(this), "translateX");
                    return false;
                });

                return _v;

            } else {

                setTransform.call(this, "translateX", size);
                return this;
            }

        },

        // translateY
        translateY: function (size) {
            if (arguments.length === 0) {

                var _v = 0;
                Mobile.each(this, function () {
                    _v = getTransformByCss.call(m(this), "translateY");
                    return false;
                });

                return _v;

            } else {
                setTransform.call(this, "translateY", size);
                return this;
            }

        },

        // translateZ
        translateZ: function (size) {
            if (arguments.length === 0) {

                var _v = 0;
                Mobile.each(this, function () {
                    _v = getTransformByCss.call(m(this), "translateZ");
                    return false;
                });

                return _v;

            } else {

                setTransform.call(this, "translateZ", size);
                return this;
            }

        },


        // scale
        scale: function () {

            if (arguments.length === 0) {

                var _v = 0;
                Mobile.each(this, function () {
                    _v = getTransformByCss.call(m(this), "scale");
                    return false;
                });

                return _v;

            } else {
                if (arguments.length === 1) {
                    setTransform.call(this, "scale", arguments[0]);
                }
                if (arguments.length === 2) {
                    setTransform.call(this, "scale", arguments[0], arguments[1]);
                }

                return this;
            }

        },

        // scaleX
        scaleX: function (size) {
            if (arguments.length === 0) {

                var _v = 0;
                Mobile.each(this, function () {
                    _v = getTransformByCss.call(m(this), "scaleX");
                    return false;
                });

                return _v;

            } else {

                setTransform.call(this, "scaleX", size);
                return this;
            }


        },

        // scaleY
        scaleY: function (size) {
            if (arguments.length === 0) {

                var _v = 0;
                Mobile.each(this, function () {
                    _v = getTransformByCss.call(m(this), "scaleY");
                    return false;
                });

                return _v;

            } else {

                setTransform.call(this, "scaleY", size);
                return this;
            }


        },


         // rotate
        rotate: function (size) {
            if (arguments.length === 0) {

                var _v = 0;
                Mobile.each(this, function () {
                    _v = getTransformByCss.call(m(this), "rotate");
                    return false;
                });

                return _v;

            } else {

                if (arguments.length >= 1) {
                    msetTransform.call(this, "rotate", size);
                }

                return this;
            }

        },

         //rotateX
         rotateX: function (size) {
             if (arguments.length === 0) {

                 var _v = 0;
                 Mobile.each(this, function () {
                     _v = getTransformByCss.call(m(this), "rotateX");
                     return false;
                 });

                 return _v;

             } else {
                 setTransform.call(this, "rotateX", size);
                 return this;
             }

         },

         // rotateY
         rotateY: function (size) {
             if (arguments.length === 0) {
                 var _v = 0;
                 Mobile.each(this, function () {
                     _v = getTransformByCss.call(m(this), "rotateY");
                     return false;
                 });

                 return _v;

             } else {
                 setTransform.call(this, "rotateY", size);
                 return this;
             }

         },


         // skew
         skew: function () {

             if (arguments.length === 0) {

                 var _v = 0;
                 Mobile.each(this, function () {
                     _v = getTransformByCss.call(m(this), "skew");
                     return false;
                 });

                 return _v;

             } else {
                 if (arguments.length === 1) {
                     setTransform.call(this, "skew", arguments[0]);
                 }
                 if (arguments.length === 2) {
                     setTransform.call(this, "skew", arguments[0], arguments[1]);
                 }

                 return this;
             }

         },

         // skewX
         skewX: function (size) {
             if (arguments.length === 0) {

                 var _v = 0;
                 Mobile.each(this, function () {
                     _v = getTransformByCss.call(m(this), "skewX");
                     return false;
                 });

                 return _v;

             } else {

                 setTransform.call(this, "skewX", size);
                 return this;
             }


         },

         // skewY
         skewY: function (size) {
             if (arguments.length === 0) {

                 var _v = 0;
                 Mobile.each(this, function () {
                     _v = getTransformByCss.call(m(this), "skewY");
                     return false;
                 });

                 return _v;

             } else {

                 setTransform.call(this, "skewY", size);
                 return this;
             }


         }


    });

}(Mobile);
