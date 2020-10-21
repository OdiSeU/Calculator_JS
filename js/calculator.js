//계산기 객체
const Calculator = function() {
  //계산기 객체를 복사
  let origin = document.querySelector("#calc-obj");
  this.element = origin.cloneNode(true);
  //화면에 보이게 설정 후 삽입
  this.element.style.display = 'inline-block';
  document.body.appendChild(this.element);
  //게산기 초기화
  this.now = "0";
  this.exp = this.element.getElementsByClassName('calc-exp')[0];
  this.exp.onchange = () => {
    //현재 옵션 제거
    this.exp[this.exp.length-1].remove();
    //변경된 기록 선택
    this.selectHist(this.exp.selectedIndex);
  }
  //계산기 클릭 이벤트 설정
  this.element.onclick = (e) => {
    this.focus();
    switch(e.target.className) {
      //숫자, 사칙연산 기호 누르면 input
      case 'calc-oper':
      case 'calc-num':
        this.input(e.target.value);
        break;
      //calc-clone버튼을 누르면 새 게산기 생성
      case 'calc-clone':
        new Calculator();
        e.cancelBubble = true;
        break;
      //calc-remove버튼을 누르면 계산기 제거
      case 'calc-remove':
        //계산기가 하나 남았을 경우 창 종료 질문
        if(document.body.children.length == 2) {
          if(confirm("계산기 창을 종료할까요?"))
            window.close();
        }
        else {
          this.element.remove();
        }
        break;
      //calc-info버튼을 누르면 내 정보 출력
      case 'calc-info':
        this.showInfo();
        break;
      //calc-claer버튼을 누르면 계산기 화면 초기화
      case 'calc-clear':
        this.clear();
        break;
      //calc-result버튼을 누르면 계산
      case 'calc-result':
        this.calc();
        break;
    }
  };
  this.focus();
};

Calculator.prototype.onKeyDown = function(e) {
  //Enter 입력 => 계산
  if(e.key == 'Enter' || e.key == '=') this.calc();
  //입력 가능한 문자를 거르는 정규식 0~9, +, -, /, *
  let regex = new RegExp(/[0-9\+\-\/\*]/);
  //정규식 검사 후 예외발생 시 입력중지
  if(!regex.test(e.key[0])) return;
  e.returnValue = false;
  //정상입력일 경우 input
  this.input(e.key[0]);
}

Calculator.prototype.input = function(input) {
  let nowIsNum = !isNaN(parseInt(this.now));
  let inputIsNum = !isNaN(parseInt(input));

  //now가 결과일 경우
  if(this.now == "result") {
    //input이 숫자면 새로운 식 입력을 위해 clear
    if(inputIsNum) this.clear();
    //기호면 계속 연산을 위해
    else nowIsNum = true;
  }
  //            입력
  //          | 기호 | 숫자
  //--- ----- |------|--------
  //   | 기호 | 교체 | 추가
  //now| 숫자 | 추가 | 추가
  //   |   0  | 추가 | 교체
  //--------------------------
  if((!nowIsNum && !inputIsNum) || (this.now=="0" && inputIsNum)) {
    //계산기 화면 마지막 문자를 입력한 문자로 교체, now 변경
    let txt = this.exp[this.exp.selectedIndex].innerText;
    this.exp[this.exp.selectedIndex].innerText = txt.substring(0,txt.length-1) + input;
    this.now = input;
  }
  else {
    //계산기 화면에 입력한 문자를 출력
    this.exp[this.exp.selectedIndex].innerText = this.exp[this.exp.selectedIndex].innerText + input;
    //now와 input의 타입이 다를경우 now 변경
    if(nowIsNum!=inputIsNum) this.now = input;
    //같을 경우 now 누적
    else this.now += input;
  }
};

//내 정보 출력
Calculator.prototype.showInfo = function () {
  confirm("Copyright by 201663025 이진성\nAnyang University");
};

//계산기 초기화
Calculator.prototype.clear = function () {
  this.now = this.exp[this.exp.selectedIndex].innerText = "0";
};

//계산
Calculator.prototype.calc = function () {
  let str = this.exp[this.exp.selectedIndex].innerText;
  //게산식의 마지막 문자가 기호일 경우 기호 제거
  if(isNaN(parseInt(str[str.length-1]))) this.exp[this.exp.selectedIndex].innerText = str = str.substring(0, str.length-1);
  //계산식에 기호가 하나도 없을 경우 return
  if(!isNaN(parseInt(str)) && (parseInt(str).toString().length == str.length)) return;
  //식 계산
  let result = eval(str);
  this.now = "result";
  this.exp[this.exp.selectedIndex].innerText = str+"="+result;
  this.selectHist(this.exp.length - 1);
};

Calculator.prototype.selectHist = function(idx) {
  //새로운 옵션 생성
  let option = document.createElement('option');
  //선택한 옵션에서 '='기호 이후에 오는 숫자를 옵션 텍스트로 설정
  option.text = this.exp[this.exp.selectedIndex].innerText.split('=')[1];
  //옵션 추가
  this.exp.add(option);
  //추가된 옵션을 선택
  this.exp.selectedIndex = this.exp.length - 1;
}

//계산기 focus
Calculator.prototype.focus = function() {
  if(focusedCalc != undefined) focusedCalc.element.className = 'calc-container';
  this.element.className = 'calc-container-focused';
  focusedCalc = this;
}
