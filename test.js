/**
 *
 * @authors l_haitao@qq.com
 * @date    2015-02-25 15:47:49
 * @version 1.0
 *
 */
// "use strict";

define(function(require, exports, module) {
	//defence
	var map = require('map').init();
	var ajax = require('l/lib-ajax').init();
	var store = require('l/lib-store').init();
	var tools = require('l/lib-tools').init();
	var jtn = require('jbn');
	//var jbn = new jsBridgeV2();
	// var staticData = {
	// 		gradeType: 1,
	// 		gradeName: "活期",
	// 		gradeTerm: 1,
	// 		gradeLowestAnnualYieldRate: "5.65",
	// 		gradeHighestAnnualYieldRate: "5.65",
	// 		gradeLowestInvestAmount: 500,
	// 		gradeHighestInvestAmount: 200000,
	// 		bankRate: 2.1,
	// 		productList: [{
	// 			productId: 1,
	// 			productName: "弘康洪金宝",
	// 			productType: "102",
	// 			gradeId: 1,
	// 			gradeType: 1,
	// 			gradeName: "每天",
	// 			gradeTerm: 1,
	// 			releventId: "100000",
	// 			productAmount: 200000,
	// 			lowestInvestAmount: 500,
	// 			annualYieldRate: 5.65,
	// 			millionIncomeProfit: 0,
	// 			productStatus: "5"
	// 		}]
	// 	}
	//default window args
	var $w = $(window).width();
	var $cot = $('#gear');
	var $rule = $('#rule');
	var $money = $('#money');
	var $gearCot = $('#gearCot');
	var $ruleCot = $('#ruleCot');
	var $moneyYq = $('#moneyYq');
	var $moneyMb = $('#moneyMb');
	var $buyProductBtn = $('#buyProductBtn')
	var $productName = $('#productName');
	var $showTips = $('#showTips');
	var $tipsMsg = $('#tipsMsg');
	var $getDay = $('#getDay');
	var $listStrD = '<li class="fl ho-h-250 dp-vc tx-c ft-col-999" style="width:#width">'+
						'<span class="ho-h-to fm-fz ho-dq">&nbsp;</span><br />'+
						'<span class="ho-h-tt fm-nbb ho-pn">&nbsp;</span><br />'+
						'<span class="ho-h-th dp-n">&nbsp;</span>'+
					'</li>';
	var $listStr = '<li class="fl ho-h-250 dp-vc tx-c ft-col-999" style="width:#width">'+
						'<span class="ho-h-to fm-fz fm-nb ho-dq">#gradeName</span><br />'+
						'<span class="ho-h-tt fm-nbb ho-pn"><span class="rateLow dp-n">#gradeLowestAnnualYieldRate~</span><span id="rateHigh">#gradeHighestAnnualYieldRate</span></span><br />'+
						'<span class="ho-h-th ft-22 dp-n fm-fz ho-tp">年化收益率</span><br />'+
						'#promotionContent'+
					'</li>';
	var $ruleStr = '<li class="bd-x bd-l-g" data-val="#val"></li>'
	var $ruleStrOn = '<li class="bd-x bd-l-g on" data-val="#val"><span class="po-ab ft-30 ft-col-ddd">#ruleNum</span></li>';
	//main code
	var defaultGrade = 1;
	var isReCon = false;
	var canvas = null,ctx = null ;
	var _x = null, _y = null , _num=null ,i = null;
	var timer = null , celldir = 0.1 , timerInterval = null;
	var databegin = null , dataend = null ,pobegin = null ,poend = null,isTimer = false ,speed = null ,maxMoney = null;
	var myAnim = null;
	var newTimer = null;
	window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function(f){ newTimer = setTimeout(function(){f()},15)};
	window.cancelAnimationFrame = window.cancelRequestAnimationFrame || window.mozCancelRequestAnimationFrame || window.webkitCancelRequestAnimationFrame || window.msCancelRequestAnimationFrame || window.cancelAnimationFrame|| window.webkitCancelAnimationFrame || function(f){ clearTimeout(newTimer)};
	var DrawRule = {
		option:{
			ruleCellWidth:14,
			ruleCellHeightl:12,
			ruleCellHeighth:24,
			ruleLength:100,
			ruleCellVal:100,
			ruleStartX:0,
			argsStartX:0,
			ruleNowVal:0,
			ruleSrartNum:20,
			canvasWidth:0,
			canvasHeight:0,
			pointStartX:0,
			pointEndX:0,
			stopDraw:false,
			totalMoney:0,
			dMaxMoney:200000
		},
		init:function(d){
			var minMoney = d.productList[0].lowestInvestAmount;
			//maxMoney = d.productList[0].productAmount;
			// console.log(d);
			//alert('canvas')
			$productName.html(d.productList[0].productName);
			var _gradeName = d.productList[0].gradeName;
			$getDay.html(_gradeName == '活期' ? '每天' : _gradeName);
			canvas = document.getElementById('ruleCot');
			ctx = canvas.getContext('2d');
			canvas.width = canvas.offsetWidth*2;
			canvas.height = canvas.offsetHeight*2;
			DrawRule.option.canvasWidth = canvas.offsetWidth*2;
			DrawRule.option.canvasHeight = canvas.offsetHeight*2;
			canvas.style.width = '';
			canvas.style.height = '';
			//DrawRule.option.argsStartX = DrawRule.returnX(minMoney);
			DrawRule.option.argsStartX = DrawRule.returnX(10000);
			DrawRule.option.ruleStartX = DrawRule.option.argsStartX;
			DrawRule.draw();
			//DrawRule.autoDraw();

			canvas.addEventListener('touchstart', DrawRule.preDraw, false);
			canvas.addEventListener('touchmove', DrawRule.move, false);
			canvas.addEventListener('touchend', DrawRule.correct, false);
		},
		returnX:function(d){
			//console.log((DrawRule.option.canvasWidth/DrawRule.option.ruleCellWidth)/2-500000/100)
			//console.log(d);
			return (DrawRule.option.canvasWidth/DrawRule.option.ruleCellWidth)/2-d/100;
			//return -16;
			//return (DrawRule.option.canvasWidth/DrawRule.option.ruleCellWidth/2);
		},
		reDraw:function(d){
			DrawRule.option.ruleStartX = DrawRule.returnX(d);
			//console.log(DrawRule.option.ruleStartX);
			DrawRule.draw();
		},

		aniDraw:function(speedt,directt){
			//console.log(Math.round(speed*0.95));
			var cl = 6;
			//console.log("speed"+speedt);
			//timerInterval = setInterval(function(){
			myAnim = function(){
				//console.info("run")
				if(speedt>0.1){
					if(directt){
						DrawRule.option.ruleStartX = DrawRule.option.ruleStartX+cl;
					}
					else{
						DrawRule.option.ruleStartX = DrawRule.option.ruleStartX-cl;
					}
					if(DrawRule.option.totalMoney<store.getStore('buyData').lowestInvestAmount){
						DrawRule.option.ruleStartX = DrawRule.returnX(store.getStore('buyData').lowestInvestAmount);
						//不能小于起够金额
						$tipsMsg.html('不能小于起购金额');
						DrawRule.option.stopDraw = false;
						$showTips.show();
						DrawRule.draw();
						//window.cancelAnimationFrame(myAnim)
						//clearInterval(timerInterval);
						return;
					}
					if(DrawRule.option.totalMoney>store.getStore('buyData').productAmount){
						// DrawRule.option.ruleStartX = DrawRule.returnX(store.getStore('buyData').productAmount);
						// //不能超过库存
						// $tipsMsg.html('不能超过库存');
						// $showTips.show();
						// DrawRule.draw();
						// //clearInterval(timerInterval);
						// DrawRule.option.stopDraw = true;
						// return;
					}
					//console.log(DrawRule.option.totalMoney);
					if(DrawRule.option.totalMoney>DrawRule.option.dMaxMoney){
						DrawRule.option.ruleStartX = DrawRule.returnX(DrawRule.option.dMaxMoney);
						//不能50W
						$tipsMsg.html('单笔最高20万元');
						DrawRule.option.stopDraw = false;
						$showTips.show();
						DrawRule.draw();
						//window.cancelAnimationFrame(myAnim)
						//clearInterval(timerInterval);
						return;
					}
					if(DrawRule.option.ruleStartX>(DrawRule.option.canvasWidth/DrawRule.option.ruleCellWidth)/2){
						//clearInterval(timerInterval);
						//window.cancelAnimationFrame(myAnim)
						DrawRule.option.stopDraw = true;
						return;
					}
					else{
						speedt = speedt*0.95;
						DrawRule.draw();
						cl = cl*0.95;
					}
					requestAnimationFrame(myAnim)
					//console.log(DrawRule.option.ruleStartX);
				}
				else{
					DrawRule.option.stopDraw = true;
					//clearInterval(timerInterval);
					//window.cancelAnimationFrame(myAnim)
				}
					//},80);

			}
			window.requestAnimationFrame(myAnim);
		},
		autoDraw:function(){
			// //DrawRule.option.ruleStartX = DrawRule.option.argsStartX;
			// console.log(DrawRule.option.ruleStartX);
			// console.log(DrawRule.option.argsStartX);
			if(DrawRule.option.ruleStartX>=DrawRule.option.argsStartX){
				//clearInterval(timer);
				//window.cancelAnimationFrame(myAnim)
				DrawRule.draw();
			}
			else{

				//timer = setTimeout(function(){
					DrawRule.draw();
					DrawRule.autoDraw();
				//},10);
			}
			DrawRule.option.ruleStartX = DrawRule.option.ruleStartX+ celldir;
		},
		drawText:function(x,y,t){
			ctx.save();
			ctx.fillStyle = 'rgb(221, 221, 221)';
			ctx.strokeStyle='rgb(221, 221, 221)';
			ctx.font = 'lighter 24px HelveticaNeue-Bold';
			ctx.textBaseline = 'top';
			ctx.textAlign = 'center';
			//ctx.translate(0.5,0);
			ctx.fillText(t, x, y);
			ctx.restore();
		},
		draw:function(){
			//console.log(DrawRule.option.stopDraw);

			if(!DrawRule.option.stopDraw){
				//canvas.width = canvas.width
				ctx.clearRect(0,0,DrawRule.option.canvasWidth,DrawRule.option.canvasHeight);
				//ctx.clearRect(-1000,-1000,3000,3000);
				//ctx.save();
				ctx.strokeStyle = 'rgb(221,221,221)';
				//ctx.save();
				//ctx.beginPath();
				//ctx.translate(0.5,0);
				//console.log(DrawRule.option.ruleStartX+(DrawRule.option.canvasWidth/DrawRule.option.ruleCellWidth/2));
				ctx.fillStyle="#FFFFFF";  //填充的颜色
				ctx.fillRect(0,0,DrawRule.option.canvasWidth,DrawRule.option.canvasHeight);  //填充颜色 x y坐标 宽 高
				for(var i = DrawRule.option.ruleStartX,j=0;i<DrawRule.option.canvasWidth/DrawRule.option.ruleCellWidth;i++){
					//console.log(i);
					if(i<0){
						continue;
					}
					_x = DrawRule.option.ruleCellWidth*i;
					_y = DrawRule.option.canvasHeight;
					_num = parseInt(i-DrawRule.option.ruleStartX)*DrawRule.option.ruleCellVal;
					if(parseInt(i-DrawRule.option.ruleStartX)%10){
						if(_x>320&&_num>200000){
							continue;
						}
						else{
							ctx.moveTo(_x, _y-DrawRule.option.ruleCellHeightl);
							ctx.lineTo(_x, _y);
						}
					}
					else{
						if(_x>320&&_num>200000){
							continue;
						}
						else{
							ctx.moveTo(_x, _y-DrawRule.option.ruleCellHeighth);
							ctx.lineTo(_x, _y);
							DrawRule.drawText(_x,(_y-DrawRule.option.ruleCellHeighth*2.2),_num);
						}
					}
					j++;
					if(j>=DrawRule.option.canvasWidth/DrawRule.option.ruleCellWidth){
						//console.log(j)
						break;
					}
				}
				//ctx.translate(0.5,0);
				ctx.stroke();
				//ctx.closePath();
				//ctx.restore();
				//ctx.restore();
				ctx.save();
				ctx.beginPath();
				ctx.strokeStyle = 'rgb(255,128,26)';
				ctx.translate(0.5,0);
				ctx.moveTo(DrawRule.option.canvasWidth/2, 0);
				ctx.lineTo(DrawRule.option.canvasWidth/2, DrawRule.option.canvasHeight);
				//ctx.translate(0.5,0);
				ctx.stroke();
				ctx.closePath();
				ctx.restore();
				//金额
				//console.log(DrawRule.option.ruleStartX)
				//console.log(Math.round(DrawRule.option.ruleStartX-Math.round((DrawRule.option.canvasWidth/DrawRule.option.ruleCellWidth)/2)));
				//console.log(isReCon)
				if(isReCon){
					var allMoney = $money.val()||0;
					DrawRule.option.totalMoney = allMoney;
					store.setStore('allMoney',{money:allMoney});

					calculateResult(allMoney);
					//console.log(beginMoney)
				}
				else{
					var allMoney = -(Math.round(DrawRule.option.ruleStartX-Math.round((DrawRule.option.canvasWidth/DrawRule.option.ruleCellWidth)/2)))*DrawRule.option.ruleCellVal;
					DrawRule.option.totalMoney = allMoney;
					$money.val(allMoney);
					// if(allMoney>maxMoney){
					// 	DrawRule.option.ruleStartX = DrawRule.returnX(maxMoney);
					// 	DrawRule.draw();
					// }

					//DrawRule.option.ruleStartX = DrawRule.option.argsStartX;
					calculateResult(allMoney);
					store.setStore('allMoney',{money:allMoney});
				}
				_x = null, _y = null , _num=null ,i = null;
			}
		},
		move:function(e){
			//console.log('b')
			e.preventDefault();
			window.cancelAnimationFrame(myAnim)
			// if(DrawRule.option.totalMoney<store.getStore('buyData').lowestInvestAmount){
			// 	alert('不能小于起够金额');
			// 	DrawRule.option.ruleStartX = DrawRule.returnX(store.getStore('buyData').lowestInvestAmount);
			// 	DrawRule.draw();
			// 	return;
			// }
			if(DrawRule.option.totalMoney<store.getStore('buyData').lowestInvestAmount){
				DrawRule.option.ruleStartX = DrawRule.returnX(store.getStore('buyData').lowestInvestAmount);
				//不能小于起够金额
				$tipsMsg.html('不能小于起购金额');
				DrawRule.option.stopDraw = false;
				$showTips.show();
				//DrawRule.draw();
				//return;
			}
			// if(DrawRule.option.totalMoney>store.getStore('buyData').productAmount){
			// 	// DrawRule.option.ruleStartX = DrawRule.returnX(store.getStore('buyData').productAmount);
			// 	// //不能超过库存
			// 	// $tipsMsg.html('不能超过库存');
			// 	// $showTips.show();
			// 	// DrawRule.draw();
			// 	// DrawRule.option.stopDraw = true;
			// 	// return;
			// }
			if(DrawRule.option.totalMoney>DrawRule.option.dMaxMoney){
				DrawRule.option.ruleStartX = DrawRule.returnX(DrawRule.option.dMaxMoney);
				//不能50W
				$tipsMsg.html('单笔最高20万元');
				DrawRule.option.stopDraw = false;
				$showTips.show();
				//DrawRule.draw();
				//return;
			}
			else{
				DrawRule.option.ruleStartX = (Math.round(DrawRule.option.ruleStartX*1000)+(Math.round(e.touches[0].clientX*100)-Math.round(DrawRule.option.pointStartX*100)))/1000;
				DrawRule.option.pointStartX = Math.round(e.touches[0].clientX*100)/100;
				var datatwo = new Date();
				dataend = datatwo.getTime();
				poend = e.changedTouches[0].clientX;
				speed = Math.abs((poend-pobegin)/(dataend-databegin)*10);
				if(speed>4){
					if(DrawRule.option.ruleStartX>(DrawRule.option.canvasWidth/DrawRule.option.ruleCellWidth)/2){
						DrawRule.option.ruleStartX = (DrawRule.option.canvasWidth/DrawRule.option.ruleCellWidth)/2;
						//clearInterval(timerInterval);
						//window.cancelAnimationFrame(myAnim)
						DrawRule.option.stopDraw = true;
						//return;
					}
					else{
						isTimer = true;
					}
				}
				else{
					isTimer = false;
					if(DrawRule.option.ruleStartX>(DrawRule.option.canvasWidth/DrawRule.option.ruleCellWidth)/2){
						DrawRule.option.ruleStartX = (DrawRule.option.canvasWidth/DrawRule.option.ruleCellWidth)/2;
						//clearInterval(timerInterval);
						//window.cancelAnimationFrame(myAnim)
						DrawRule.option.stopDraw = true;
						//return;
					}
					// else if(-(Math.round(DrawRule.option.ruleStartX-Math.round((DrawRule.option.canvasWidth/DrawRule.option.ruleCellWidth)/2)))*DrawRule.option.ruleCellVal>maxMoney){
					// 	//DrawRule.option.ruleStartX = (DrawRule.option.canvasWidth/DrawRule.option.ruleCellWidth)/2;
					// 	//clearInterval(timerInterval);
					// 	DrawRule.option.stopDraw = true;
					// 	return;
					// }
					else{
						DrawRule.option.stopDraw = false;
						DrawRule.draw();
					}
				}

			}
		},
		correct:function(e){
			//console.log('c')
			if(isTimer){
				var direct = (poend-pobegin)>0?true:false;
				DrawRule.option.stopDraw = false;
				DrawRule.aniDraw(Math.round(speed),direct);
			}
			//console.log(DrawRule.option.totalMoney<store.getStore('buyData').lowestInvestAmount)
			if(DrawRule.option.totalMoney<store.getStore('buyData').lowestInvestAmount){
				DrawRule.option.ruleStartX = DrawRule.returnX(store.getStore('buyData').lowestInvestAmount);
				//console.log(DrawRule.option.ruleStartX);
				$tipsMsg.html('不能小于起购金额');
				DrawRule.option.stopDraw = false;
				$showTips.show();
				DrawRule.draw();
				//return;
			}

			if(DrawRule.option.totalMoney>DrawRule.option.dMaxMoney){
				DrawRule.option.ruleStartX = DrawRule.returnX(DrawRule.option.dMaxMoney);
				//不能50W
				$tipsMsg.html('单笔最高20万元');
				DrawRule.option.stopDraw = false;
				$showTips.show();
				DrawRule.draw();
				//return;
			}
		},
		preDraw:function(e){
			isReCon  = false;
			isTimer = false;
			//alert(window.cancelAnimationFrame)
			window.cancelAnimationFrame(myAnim);
			DrawRule.option.stopDraw = true;
			var dataone = new Date();
			databegin = dataone.getTime();
			pobegin = e.touches[0].clientX;
			DrawRule.option.pointStartX = Math.round(e.touches[0].clientX*100)/100;
			//alert(DrawRule.option.pointStartX)
			DrawRule.option.ruleStartX = DrawRule.returnX($money.val());
			DrawRule.draw();
			//alert(window.cancelAnimationFrame)
		}
	}

	//save Date
	function saveDate(index){
		var myData = store.getStore('gearList');
		// console.log(store);
		store.setStore('buyMesg',myData[index]);
	}
	function buyDate(index){
		var buyData = store.getStore('buyMesg').productList;
		store.setStore('buyData',buyData[index]);
	}
	//
	function product(){

	}
	//calculate
	function calculateResult(m){
		//console.log(m);
		m = Number(m);
		var myProduct = store.getStore('buyMesg');
		var myProductl = myProduct.length;
		var myProductone = myProduct.productList[0], myProducttwo = myProduct.productList[1];
		var yqsyl = myProduct.gradeLowestAnnualYieldRate , lcday = null,productName = null,gradeName = null ,lowestInvestAmount = null;
		//var bankrate = [0.35,2.10,2.30,2.50,3.10,3.75];
		var ismore = myProducttwo?myProduct.productList[1].lowestInvestAmount:200000;
		var bankrate = {
			day1:0.35,
			day7:0.35,
			day14:0.35,
			day21:0.35,
			day30:0.35,
			day60:0.35,
			day89:1.60,
			day180:1.80,
			day365:2.00,
			day720:2.60,
			day1080:3.25
		}
		//console.log(myProducttwo&&myProductone.productStatus==2&&myProductone.productStatus!=4&&m>myProduct.productList[0].lowestInvestAmount&&m<myProduct.productList[1].lowestInvestAmount)
		if(myProductone&&myProductone.productStatus==2&&myProductone.productStatus!=4&&m>myProduct.productList[0].lowestInvestAmount&&m<ismore){
			yqsyl = myProduct.productList[0].annualYieldRate/100;
			lcday = myProduct.productList[0].gradeTerm == 0 ? 1 : myProduct.productList[0].gradeTerm;
			productName = myProduct.productList[0].productName;
			gradeName = myProduct.productList[0].gradeName;
			lowestInvestAmount = myProduct.productList[0].lowestInvestAmount;
			buyDate(0);
		}
		else if(myProducttwo&&myProducttwo.productStatus==2&&myProducttwo.productStatus!=4&&m>myProduct.productList[1].lowestInvestAmount){
			yqsyl = myProduct.productList[1].annualYieldRate/100;
			lcday = myProduct.productList[1].gradeTerm == 0 ? 1 : myProduct.productList[1].gradeTerm;
			productName = myProduct.productList[1].productName;
			gradeName = myProduct.productList[1].gradeName;
			lowestInvestAmount = myProduct.productList[1].lowestInvestAmount;
			buyDate(1);
			// DrawRule.option.ruleStartX = DrawRule.returnX(store.getStore('buyData').productAmount);
			// //不能超过库存
			// $tipsMsg.html('不能超过库存');
			// $showTips.show();
			// DrawRule.draw();
			// DrawRule.option.stopDraw = true;
		}
		else{
			yqsyl = myProduct.productList[0].annualYieldRate/100;
			lcday = myProduct.productList[0].gradeTerm == 0 ? 1 : myProduct.productList[0].gradeTerm;
			productName = myProduct.productList[0].productName;
			gradeName = myProduct.productList[0].gradeName;
			buyDate(0);
			//.....
		}

		//bg-col-ccc
		var isHas = store.getStore('buyData').productStatus;
		if(isHas==2){
			if(store.getStore('buyData').canBuyAmout == 0){
				$('.productDetail').show();
				$buyProductBtn.removeClass('bg-col-00d397').addClass('bg-col-ccc').html('已抢光');
			}else{
				$('.productDetail').show();
				$buyProductBtn.removeClass('bg-col-ccc').addClass('bg-col-00d397').html('存钱');
			}
		}
		else if(isHas==4){
			$('.productDetail').show();
			$buyProductBtn.removeClass('bg-col-00d397').addClass('bg-col-ccc').html('已抢光');
		}
		else if(isHas==5){
			$('.productDetail').hide();
			$buyProductBtn.removeClass('bg-col-00d397').addClass('bg-col-ccc').html('敬请期待');
		}
		else{
			//....
		}
		//hq
		var isHq = store.getStore('buyData').gradeTerm;
		if(isHq == 0){
			var _hqInfo = store.getStore('hqInfo') || '';
			// var _hqInfo = {isCanPay: "false", isHaveHq: "true", policyNo: "86000020150250243315"};
			// console.log(_hqInfo);
			// console.log(_hqInfo && (_hqInfo.isCanPay == 'false') && (_hqInfo.isHaveHq == 'true'));
			if(_hqInfo && (_hqInfo.isCanPay == 'false') && (_hqInfo.isHaveHq == 'true')){
				$buyProductBtn.removeClass('bg-col-00d397').addClass('bg-col-ccc').html('首次购买次日可续存');
			}
		}
		// console.log(typeof m);
		// console.log(yqsyl);
		// console.log(yqsyl-bankrate['day'+lcday]);
		// console.log(lcday);
		//console.log(myProduct.productList[1].productAmount);
		//旧利率算法
		// var moneyYq = (yqsyl*lcday*m/365).toFixed(2).toString();
		// console.log();
		var moneyYq = (m*(Math.pow(1+yqsyl,lcday/365)-1)).toFixed(2).toString();
		// console.log(yqsyl);
		// console.log(lcday);
		// console.log(m);
		var moneyYqt = moneyYq.split('.')[0]+'.'+moneyYq.split('.')[1].substring(0,2);
		// var morebankYq = ((yqsyl-bankrate['day'+Math.abs(lcday)]/100)*lcday*m/365).toFixed(2).toString();
		var morebankYq = ((bankrate['day'+Math.abs(lcday)]/100)*lcday*m/365).toFixed(2).toString();
		// console.log(morebankYq);
		var morebankYqt = morebankYq.split('.')[0]+'.'+morebankYq.split('.')[1].substring(0,2);
		//console.log((yqsyl*lcday*m/365).toString().split('.')[0])
		$moneyYq.html(moneyYqt);
		$moneyMb.html(morebankYqt);
		$productName.html(productName);
		$getDay.html(gradeName == '活期'? '每天' : gradeName);
	}

	//create gear bind event
	function gearMove(a,b,c){
		saveDate(defaultGrade-1);
		//calculateResult(store.getStore('allMoney').money);
		//clearInterval(timerInterval);
		//window.cancelAnimationFrame(myAnim)
		DrawRule.option.stopDraw = false;
		//if(){
			//DrawRule.init(store.getStore('buyMesg'));
		// //}
		// console.log(c)
		// console.log(store.getStore('buyMesg').gradeLowestInvestAmount);
		if(store.getStore('buyMesg').gradeLowestInvestAmount>DrawRule.option.totalMoney){
			DrawRule.init(store.getStore('buyMesg'));
		}
		else{
			calculateResult(DrawRule.option.totalMoney);
		}
		$gearCot.find('ul').find('span').removeClass('ho-h-on');
		$gearCot.find('ul').find('li').eq(defaultGrade).find('span').addClass('ho-h-on');
		$gearCot.find('ul').animate({'margin-left':-(defaultGrade-1)*($w/4)},300);
		if(a&&b&&c){
			$gearCot.find('li').eq(a).animate({'width':($w/4)+'px'},300).find('.ho-h-tt').animate({'font-size':'1rem'},300);
			$gearCot.find('li').eq(a).animate({'width':($w/4)+'px'},300).find('.ho-h-to').animate({'font-size':'0.75rem'},300);
			$gearCot.find('li').eq(b).animate({'width':(2*$w/4)+'px'},300).find('.ho-h-tt').animate({'font-size':'1.875rem'},300);
			$gearCot.find('li').eq(b).animate({'width':(2*$w/4)+'px'},300).find('.ho-h-to').animate({'font-size':'0.9375rem'},300);
			$gearCot.find('ul').find('li').eq(a).find('.rateLow').hide();
			$gearCot.find('ul').find('li').eq(b).find('.rateLow').show();
		}
		else{
			$gearCot.find('li').eq(b).animate({'width':($w/4)+'px'},300).find('.ho-h-tt').animate({'font-size':'1rem'},300);
			$gearCot.find('li').eq(b).animate({'width':($w/4)+'px'},300).find('.ho-h-to').animate({'font-size':'0.75rem'},300);
			$gearCot.find('li').eq(a).animate({'width':(2*$w/4)+'px'},300).find('.ho-h-tt').animate({'font-size':'1.875rem'},300);
			$gearCot.find('li').eq(a).animate({'width':(2*$w/4)+'px'},300).find('.ho-h-to').animate({'font-size':'0.9375rem'},300);
		}
	}
	function bindGear(l){
		var gstartX = null, gmidX = null, gendX = null, marginLeft = null, next = null,pre = null;
		var startTime = null, endTime = null;
		document.getElementById('gearCot').addEventListener('touchstart', function(e){
			e.preventDefault();
			gstartX = e.touches[0].clientX;
			var t = new Date();
			startTime = t.getTime();
		},false);
		document.getElementById('gearCot').addEventListener('touchmove', function(e){
			gmidX = e.touches[0].clientX;
			$gearCot.find('ul').css('margin-left',-(defaultGrade-1)*($w/4)+(gmidX - gstartX)/4);
			//console.log(defaultGrade-1);
			if(gmidX - gstartX>0){
				pre = defaultGrade - 1;
				$gearCot.find('li').eq(defaultGrade).css('width',(2*$w/4-$w/4*Math.abs(gmidX - gstartX)/$w)+'px').find('.ho-h-tt').css('font-size',1.875-0.875*Math.abs(gmidX - gstartX)/$w+'rem');
				$gearCot.find('li').eq(defaultGrade).css('width',(2*$w/4-$w/4*Math.abs(gmidX - gstartX)/$w)+'px').find('.ho-h-to').css('font-size',0.9375-0.1875*Math.abs(gmidX - gstartX)/$w+'rem');
				$gearCot.find('li').eq(pre).css('width',($w/4+$w/4*Math.abs(gmidX - gstartX)/$w)+'px').find('.ho-h-tt').css('font-size',1+0.875*Math.abs(gmidX - gstartX)/$w+'rem');
				$gearCot.find('li').eq(pre).css('width',($w/4+$w/4*Math.abs(gmidX - gstartX)/$w)+'px').find('.ho-h-to').css('font-size',0.75+0.1875*Math.abs(gmidX - gstartX)/$w+'rem');
			}
			else{
				next = defaultGrade + 1;
				$gearCot.find('li').eq(defaultGrade).css('width',(2*$w/4-$w/4*Math.abs(gmidX - gstartX)/$w)+'px').find('.ho-h-tt').css('font-size',1.875-0.875*Math.abs(gmidX - gstartX)/$w+'rem');
				$gearCot.find('li').eq(defaultGrade).css('width',(2*$w/4-$w/4*Math.abs(gmidX - gstartX)/$w)+'px').find('.ho-h-to').css('font-size',0.9375-0.1875*Math.abs(gmidX - gstartX)/$w+'rem');
				$gearCot.find('li').eq(next).css('width',($w/4+$w/4*Math.abs(gmidX - gstartX)/$w)+'px').find('.ho-h-tt').css('font-size',1+0.875*Math.abs(gmidX - gstartX)/$w+'rem');
				$gearCot.find('li').eq(next).css('width',($w/4+$w/4*Math.abs(gmidX - gstartX)/$w)+'px').find('.ho-h-to').css('font-size',0.75+0.1875*Math.abs(gmidX - gstartX)/$w+'rem');
			}
		},false)
		var df = null,nx = null;
		$gearCot.find('li').bind('touchend',function(){
			var t2 = new Date();
			endTime = t2.getTime();
			df = $(this).index();
			nx = defaultGrade;
		})
		document.getElementById('gearCot').addEventListener('touchend', function(e){
			gendX = e.changedTouches[0].clientX;
			//gstartX = gendX;
			if(endTime-startTime<180&&Math.abs(gendX-gstartX)<5){
				if(df!=defaultGrade&&df!=0){
					if(df>nx){
						defaultGrade = defaultGrade +1;
						gearMove(nx,df,true);
					}
					else{
						defaultGrade = defaultGrade -1;
						gearMove(nx,df,true);
					}
				}
			}
			else{
				if(gstartX<gendX){
					//right
					if((gendX-gstartX)>($w/4)){
						//console.log(defaultGrade)
						if(defaultGrade<=1){
							$gearCot.find('ul').animate({'margin-left':0},200);
							$gearCot.find('li').eq(defaultGrade).css('width',(2*$w/4)+'px').find('.ho-h-tt').animate({'font-size':'1.875rem'},200);
							$gearCot.find('li').eq(defaultGrade).css('width',(2*$w/4)+'px').find('.ho-h-to').animate({'font-size':'0.9375rem'},200);
							$gearCot.find('li').eq(pre).css('width',($w/4)+'px').find('.ho-h-tt').animate({'font-size':'1.875rem'},200);
							$gearCot.find('li').eq(pre).css('width',($w/4)+'px').find('.ho-h-to').animate({'font-size':'0.9375rem'},200);
							return;
						}
						else{
							defaultGrade  = defaultGrade - 1;
						}
						gearMove(defaultGrade+1,pre,true);
					}
					else{
						gearMove(defaultGrade,pre);
					}
				}
				else{
					if((gstartX-gendX)>($w/4)){
						if(defaultGrade>=l){
							$gearCot.find('ul').animate({'margin-left':-($w/4)*(l-1)},200);
							$gearCot.find('li').eq(defaultGrade).css('width',(2*$w/4)+'px').find('.ho-h-tt').animate({'font-size':'1.875rem'},200);
							$gearCot.find('li').eq(defaultGrade).css('width',(2*$w/4)+'px').find('.ho-h-to').animate({'font-size':'0.9375rem'},200);
							$gearCot.find('li').eq(next).find('.ho-h-tt').animate({'font-size':'1.875rem'},200);
							$gearCot.find('li').eq(next).find('.ho-h-to').animate({'font-size':'0.9375rem'},200);
							return;
						}
						else{
							defaultGrade  = defaultGrade + 1;
						}
						gearMove(defaultGrade-1,next,true);
					}
					else{
						gearMove(defaultGrade,next);
					}
				}
			}
		},false);
	}
	function createGear(d){
		var l = d.length;
		var htmlstr = $listStrD.replace('#width',($w/4)+'px');
		$cot.width((l+4)*($w/4));
		for(var i=0;i<l;i++){
			if(d[i].productList.length>1){
				htmlstr += $listStr.replace('#width',($w/4)+'px').replace('#gradeName',d[i].gradeName).replace('#promotionContent',(d[i].productList[0].promotionContent?'<span class="ho-h-tf ft-20 dp-n fm-fz ho-tf bd-x bd-nl-g bd-nt-g bd-nr-g bd-nb-g promotion-content" data-index='+i+'>'+d[i].productList[0].promotionContent+'</span>':'')).replace('#gradeLowestAnnualYieldRate',d[i].productList[0].annualYieldRate+'%').replace('#gradeHighestAnnualYieldRate',d[i].productList[1].annualYieldRate+'%');
			}
			else{
				htmlstr += $listStr.replace('#width',($w/4)+'px').replace('#gradeName',d[i].gradeName).replace('rateLow','').replace('#promotionContent',(d[i].productList[0].promotionContent?'<span class="ho-h-tf ft-20 dp-n fm-fz ho-tf bd-x bd-nl-g bd-nt-g bd-nr-g bd-nb-g promotion-content" data-index='+i+'>'+d[i].productList[0].promotionContent+'</span>':'')).replace('#gradeLowestAnnualYieldRate','').replace('#gradeHighestAnnualYieldRate',d[i].productList[0].annualYieldRate+'%');
			}
			//htmlstr += $listStr.replace('#width',($w/3)+'px').replace('#gradeName',d[i].gradeName).replace('#gradeLowestAnnualYieldRate',(Number(d[i].gradeLowestAnnualYieldRate)*100).toFixed(3)+'%');
		}
		$cot.append(htmlstr);
		//活动详情按钮
		$cot.find('.promotion-content').on('touchend',d,function(){
			var _index = $(this).data('index'),
				_content = d[_index].productList[0].extra1  || '暂无内容';
			tools.screeTips('活动详情','<p class="remindword">'+ _content +'</p>');
			event.preventDefault();
		});
		if(defaultGrade<=0){
			//console.log($gearCot.find('li').eq(1))
			$gearCot.find('ul').find('li').eq(1).find('span').addClass('ho-h-on');
			$gearCot.find('ul').animate({'margin-left':0},300);
		}
		else{
			$gearCot.find('ul').find('li').eq(defaultGrade).css('width',(2*$w/4)+'px').find('span').addClass('ho-h-on');
			$gearCot.find('ul').animate({'margin-left':-(defaultGrade-1)*($w/4)},300);
			$gearCot.find('ul').find('li').eq(defaultGrade).find('.rateLow').show();
		}
		bindGear(l);
	}

	//create rule bind event
	function bindRule(){
		$money.focus(function(){
			//$(this).val('');
			isReCon  = true;
		})
		$money.bind('input',function(){
			var val = $(this).val();
			if(val>200000){
				val = 200000;
			}
			$(this).val(val);
		})
		$money.blur(function(){
			var val = $(this).val()||0;
			if(val<100||val%100>0){
				isReCon  = true;
			}
			else{
				isReCon  = false;
			}
			if(Number(val)<Number(store.getStore('buyData').lowestInvestAmount)){
				val = store.getStore('buyData').lowestInvestAmount;
			}
			if(val>200000){
				val = 200000;
			}
			DrawRule.option.stopDraw = false;
			$(this).val(val);
			DrawRule.reDraw(val);
		})
	}
	function createRule(){
		var ruleArgs = map.xbRule;
		var htmlstr = '';
		for(var i=0;i<ruleArgs.ruleLength;i++){
			htmlstr += ((i%10))?$ruleStr.replace('#val',ruleArgs.ruleRulCell*i):$ruleStrOn.replace('#val',ruleArgs.ruleRulCell*i).replace('#ruleNum',ruleArgs.ruleRulCell*i);
		}
		$rule.append(htmlstr);
	}

	window.getSidt = function(d){
		if(typeof d !='object'){
			d = $.parseJSON(d);
		}
		if(d&&d.share){
			return;
		}
		//{data:23423iifsoidiosdf}
		var vale = parseInt($money.val());
		var fs = parseInt(vale/Number(store.getStore('buyData').lowestInvestAmount));
		var val = Number(store.getStore('buyData').lowestInvestAmount)*fs;

		store.setStore('clientMsg',{sid:d.data,source:'app'});
		//store.setStore('clientMsg',{source:source,sid:sid});
		//store.getStore('clientMsg').sid
		store.removeStore('totalItem');
		var a = map.xbAl.bxUrl+'?fillInsur='+store.getStore('buyData').releventId+'&val='+val+'&fs='+fs+'&gradeName='+encodeURI(store.getStore('buyData').gradeName)+'&source='+store.getStore('clientMsg').source+'&sid='+store.getStore('clientMsg').sid+'&bizType=2';
		//window.location = 'http://www.baidu.com'
		if(parseInt(val) > parseInt(store.getStore('buyData').canBuyAmout)){
			$tipsMsg.html('不能超过库存');
			$showTips.show();
			return;
		}
		var aHqList = {};
		$.each(store.getStore('gearList'), function(key,value){
			if(value.gradeTerm == 0){
				aHqList = value.productList;
			}
		});
		ajax.getAjax(map.xbAl.xbgetHqInfo,{productId:aHqList[0].releventId,sid:decodeURIComponent(store.getStore('clientMsg').sid),source:'app'},function(data){
			store.setStore('hqInfo',data);
			goToBuyLink (val,fs);
		});
		// window.location.href = map.xbAl.bxUrl+'?fillInsur='+store.getStore('buyData').releventId+'&val='+val+'&fs='+fs+'&gradeName='+encodeURI(store.getStore('buyData').gradeName)+'&source='+store.getStore('clientMsg').source+'&sid='+store.getStore('clientMsg').sid+'&bizType=2';
	}
	function setCookie(name,value) {
			var Days = 30;
			var exp = new Date();
			exp.setTime(exp.getTime() + Days*24*60*60*1000);
			document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
		}
	function is_weixn(){
		var ua = navigator.userAgent.toLowerCase();
		if(ua.match(/MicroMessenger/i)=="micromessenger") {
			return true;
		}
		else {
			return false;
		}
	}
	function bindEvent(){
		// $buyProductBtn.bind('touchstart',function(){
		// 	$(this).addClass('bg-col-00b783')
		// })
		// $buyProductBtn.bind('touchend',function(){
		// 	$(this).removeClass('bg-col-00b783')
		// })
		// $buyProductBtn.tap(function(){
		$buyProductBtn.on('touchend',function(){
			if(!$(this).hasClass('bg-col-ccc')){
				var producttype = store.getStore('buyData').productType;
				//console.log(store.getStore('buyData').productType)
				if(producttype==101){//jj
					window.location.href='fund/tobuy.html?itemId='+store.getStore('buyData').productId;
				}
				else if(producttype==102){//bx
					var vale = parseInt($money.val());
					var fs = parseInt(vale/Number(store.getStore('buyData').lowestInvestAmount))||1;
					var val = Number(store.getStore('buyData').lowestInvestAmount)*fs||Number(store.getStore('buyData').lowestInvestAmount);
					//console.log(decodeURIComponent(store.getStore('buyData').gradeName))
					//alert(!store.getStore('clientMsg').sid);
					if(is_weixn()){
						// window.location.href = 'http://jrappgw.jd.com/wxjdissue/JDIssue/login2?source=999&info='+store.getStore('isWeixn').info+'&returnUrl='+encodeURIComponent(map.xbAl.bxUrl+'?fillInsur='+store.getStore('buyData').releventId+'&val='+val+'&fs='+fs+'&gradeName='+encodeURIComponent(store.getStore('buyData').gradeName)+'&source=app&bizType=2');
						if(tools.getQuery('sid')){
							goToBuyLink(val,fs);
						}else{
							window.location.href = 'http://jrappgw.jd.com/wxjdissue/JDIssue/login2?source=999&info='+store.getStore('isWeixn').info+'&returnUrl='+encodeURIComponent('http://'+window.location.host+window.location.pathname+'?fillInsur='+store.getStore('buyData').releventId+'&source=app&bizType=2');
						}
					}
					else{
						if(!store.getStore('clientMsg').sid){//jbn
							var navUsAg = navigator.userAgent.toLowerCase();
							var isOur = /jdjr-app/.test(navUsAg);
							if(isOur){
								//var jbn = new jsBridgeV2(getSid);
								var option = {type:1,data:''};
								jsBton.jsToGetResp(option);
							}
							else{
								window.location.href = 'http://passport.m.jd.com/user/login.action?v=t&sid=&returnurl='+encodeURIComponent(window.location.href);
								//window.location.href=map.xbAl.bxUrl+'?fillInsur='+store.getStore('buyData').releventId+'&val='+val+'&fs='+fs+'&gradeName='+encodeURI(store.getStore('buyData').gradeName)+'&source='+store.getStore('clientMsg').source+'&sid='+store.getStore('clientMsg').sid+'&bizType=2';
							}
						}
						else{
							store.removeStore('totalItem');
							// console.log(store.getStore('buyData'));
							// console.log(val);
							if(parseInt(val) > parseInt(store.getStore('buyData').canBuyAmout)){
								$tipsMsg.html('不能超过库存');
								$showTips.show();
								return;
							}
							goToBuyLink(val,fs);
						}
					}
				}
				else{

				}
			}
			event.preventDefault();
		})
		$showTips.bind("webkitAnimationEnd", function () {
			$(this).hide();
		});
		$('.home-tip-cot').bind('touchstart',function(){
			$(this).find('.home-tip').addClass('home-tip-on');
		})
		$('.home-tip-cot').bind('touchend',function(){
			$(this).find('.home-tip').removeClass('home-tip-on');
			tools.screeTips('收益说明','<p class="remindword">年化收益率每日会有波动，收益也会波动。预期收益仅作为参考，请以实际收益为准</p>');
		})
		$('.productDetail').tap(function(){
			window.location.href = map.xbAl.bxUrl+'?sid='+store.getStore('clientMsg').sid+'&souce='+store.getStore('clientMsg').source+'&itemId='+store.getStore('buyData').releventId+'&bizType=2#detail';
		})
		$('#help').tap(function(){
			window.location.href = 'help.html'+window.location.search;
		})
		$('#goindex').tap(function(){
			//sessionStorage.show1 = false;
			setCookie('show1','false');
			$('#J_opaPage').show();
			 $('#Home').hide();
			//window.location.href = 'index.html'+window.location.search;
		})
	}
	// 购买规则跳转
	function goToBuyLink (val,fs){
		var isHq = store.getStore('buyData').gradeTerm;
		if(isHq == 0){
			var _hqInfo = store.getStore('hqInfo') || '';
			if(_hqInfo && (_hqInfo.isCanPay == 'true') && (_hqInfo.isHaveHq == 'true')){
				//活期二次追加链接
				window.location.href=map.xbAl.bxUrl+'?orderId='+_hqInfo.orderNo+'&val='+val+'&sid='+store.getStore('clientMsg').sid+'&source='+store.getStore('clientMsg').source+'&bizType=2#addbuyinsur';
			}else{
				window.location.href=map.xbAl.bxUrl+'?fillInsur='+store.getStore('buyData').releventId+'&val='+val+'&fs='+fs+'&gradeName='+encodeURI(store.getStore('buyData').gradeName)+'&source='+store.getStore('clientMsg').source+'&sid='+store.getStore('clientMsg').sid+'&bizType=2';
			}
		}else{
			window.location.href=map.xbAl.bxUrl+'?fillInsur='+store.getStore('buyData').releventId+'&val='+val+'&fs='+fs+'&gradeName='+encodeURI(store.getStore('buyData').gradeName)+'&source='+store.getStore('clientMsg').source+'&sid='+store.getStore('clientMsg').sid+'&bizType=2';
		}
	}
	//callback
	function callback(d){
		// d.unshift(staticData);
		// console.log(d);
		store.setStore('gearList',d);
		createGear(d);
		saveDate(defaultGrade-1);
		DrawRule.init(store.getStore('buyMesg'));
		bindEvent();
		// DrawRule.option.ruleStartX = DrawRule.returnX(0);
  //       DrawRule.draw();
	}
	function findHq (arry){
		for(var i=0;i<arry.length;i++){
			if(arry[i].gradeTerm == 0){
				return arry[i].productList;
			}
		}
		return null;
	}
	function start(){
		if(is_weixn()){
			$('.wx-tx').show();
		}
		bindRule();
		var source = tools.getQuery('source')||'';
		var sid = tools.getQuery('sid')||'';
		store.setStore('clientMsg',{source:source,sid:sid});
		store.setStore('isWeixn',{info:tools.getQuery('info')||''});
		ajax.getAjax(map.xbAl.xbGetProductList,{},function(d){
			// console.log(d);
			if(store.getStore('clientMsg').sid){
				var aHqList = findHq(d);
				// console.log(aHqList[0].releventId);
				ajax.getAjax(map.xbAl.xbgetHqInfo,{productId:aHqList[0].releventId,sid:sid,source:source},function(data){
					store.setStore('hqInfo',data);
					callback(d);
				});
			}else{
				callback(d);
			}
		});
	}
	//exports
	exports.init = function(){
		start();
	}
})
