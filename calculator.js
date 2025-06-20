//html 요소선택
const display = document.querySelector('.display'); //document html을 분해한거, 그래서 .querySelecter는 하나의 요소만 들고옴
const button = document.querySelectorAll('.button');// .querySelectorAll 모든 일치요소 들고옴

// 상태 변수 (계속 유지되어야 하므로 바깥에 선언)
let firstOperand = null; // 첫번째 숫자 저장
let operator = null; // 연산자 저장
let shouldReset = false; // 다음 숫자 입력 시 화면 초기화 할지 여부

//변수할당
for (let i = 0; i < button.length; i++) {
    const btn = button[i];
    // console.log(btn.value);
    //버튼의 갯수에 넘버를 붙여서 그 넘버에 해당하는 .value값을 가져온다
    // value 값을 쓰는 이유 : 실제로 사용할 값 분리, 일관된 타입보장, 폼제출시 편리, 유지보수편리, 

    //클릭 시 반환값
    btn.addEventListener('click', () => { //addEventListener : DOM요소에 이벤트를 등록하는 메서드 / 익명함수 : 이름이 없는 함수. 한번만 쓰이는 짧은 로직에 자주사용
        const val = btn.value; //btn의 value프로퍼티값을 val이라는 변수에 담는다
        // console.log(val);
        //메서드(함수) : 객체에 소속된 함수 / 객체 : 키:값이 합쳐진 자료구조 / 프로퍼티(데이터) : 값이 들어있는 일반 키
        //버튼을 클릭하면 버튼.value값을 val로 가져온다

        //초기화
        if (val === 'C') {
            display.textContent = '0';
            firstOperand = null;
            operator = null;
            shouldReset = false;
            return; // 값 반환
        }
        //클릭한게 C이면 display.textContent를 0으로 반환한다.

        //소수점
        if (val === '.') {
            //소수점이 없는경우
            if (!display.textContent.includes('.')) {//includes : 참과 거짓을 판별하는 메서드 디스플레이에 텍스트가 .이 붙지않을경우 문자열 뒤에 .을 붙인다 
                display.textContent += '.'; //소수점이 없을경우 추가
            }
            shouldReset=false;
            return;
        }

        //사칙연산
        if (btn.classList.contains('operator')) {
            const currentValue = parseFloat(display.textContent);// 현재 값 저장 / parsFloat : 문자열을 숫자로 바꿔주는 함수

            //이전에 연산자가 있고, 리셋상태가 아닐때 자동계산
            if(firstOperand !==null && operator !==null && !shouldReset){//첫번째 숫자가 null이 아니고, 연산자가 null이 아니고 초기화아닐대
                const result = calculate(firstOperand, operator, currentValue); //계산한다
                display.textContent = String(result); //계산한걸 문자열로 가져오고 디스플레이에 보여준다 , string을 쓰는이유 : 타입안정성 때문.
                firstOperand = result; //첫번째는 계산한 값이다 
            }else{ // 조건이 아니면
                firstOperand=currentValue //연산 처음입력시 저장
            }
            operator = val; //입력값(어떤연산자인지 저장)
            shouldReset = true; //다음숫자는 새로 입력되도록
            console.log(`firstOperand : ${firstOperand} \nOperator : ${operator}`)
            return;
        }

                //부호+-
        if(val === '±'){
            if(display.textContent !== '0') { //화면이 0이 아니면
                display.textContent = String(parseFloat(display.textContent)* -1); // * -1을 붙인다
            }
            shouldReset = false;
            return;
        }

        //백분율%
        if(val === '%'){
            display.textContent = String(parseFloat(display.textContent)/100); ///100을해서 백분율
            shouldReset = true; //백분율 계산 후 새 숫자 입력
            return;
        }

        // 계산
        if (val === '=') {
            if (firstOperand !== null && operator !== null) { //null값이 아닌경우에만 계산 첫번째숫자가 입력되어있어야하고, 연산자가 선택되어있을때
                const secondOperand = parseFloat(display.textContent); //현재 값 저장
                const result = calculate(firstOperand, operator, secondOperand); //calculate : 사칙연산을 계산해주는 함수
                display.textContent = String(result); //숫자를 문자열로 넣어줌
                console.log(`secondOperand : ${secondOperand} \nvalue : ${val} \nresult : ${result}`)

                //상태초기화
                firstOperand = null;
                operator = null;
                shouldReset = true;
                console.log(val)
        }
            return;
        }

        //숫자
        //숫자가 아닌 것
        if (!btn.classList.contains('number'))
            return;
        //넘버 클래스가 붙어있는지 확인 후 함수종료

        //숫자일 경우
        if (display.textContent === '0' || shouldReset) { // 디스플레이가 0이거나 리셋됐을때 shouldReset===true. true인 이유는 사칙연산을 누르고 숫자를 눌렀을때 true값이기 때문
            //숫자를 눌렀을때 디스플레이가 0(처음 계산시작) 또는 shouldReset가 트루일경우 디스플레이가 0이 아닌경우엔 뒤에껄 확인
            display.textContent = val; // 버튼을 누른게 화면에 출력된다
            shouldReset = false; //출력된 상태로 추가되어야 때문에 false
        } else {
            display.textContent += val; //화면에 이미 12가 있는경우 그뒤로 숫자를 누르면 계속 옆으로 추가되어야함
        }

        // console.log(display);
    });
}

//사칙연산 계산함수
function calculate(a, op, b) {
    const x = parseFloat(a);
    const y = parseFloat(b);
    switch (op) {
        case '+': return x + y;
        case '-': return x - y;
        case '*': return x * y;
        case '/': return x / y;
        default: return 0;
    }
}










//반복문 방법
//html에서 보이는대로 dom에 가져오는방법
//이벤트 버블링
//함수선언문



// 부호 전환
if (val === '±') {
    if (display.textContent !== '0') {
        display.textContent = String(parseFloat(display.textContent) * -1);
    }
    return;
}


// 퍼센트 계산
if (val === '%') {
    display.textContent = String(parseFloat(display.textContent) / 100);
    shouldReset = true;
    return;
}


document.addEventListener('keydown', (e) => {
    const key = e.key;

    // 숫자 0~9
    if (!isNaN(key)) {
        simulateClick(key);
    }

    // 연산자
    if (['+', '-', '*', '/'].includes(key)) {
        simulateClick(key);
    }

    // Enter → =
    if (key === 'Enter') {
        simulateClick('=');
    }

    // 소수점
    if (key === '.') {
        simulateClick('.');
    }

    // 퍼센트
    if (key === '%') {
        simulateClick('%');
    }

    // 부호 전환 (예: Shift + - → ± 로 직접 맵핑하려면 커스터마이징 필요)
    if (key === '_') {
        simulateClick('±');
    }

    // 초기화 (Escape)
    if (key === 'Escape') {
        simulateClick('C');
    }

    // Backspace 기능 추가 (선택사항)
    if (key === 'Backspace') {
        if (display.textContent.length === 1 || display.textContent === '0') {
            display.textContent = '0';
        } else {
            display.textContent = display.textContent.slice(0, -1);
        }
    }
});

// 버튼 value를 이용한 클릭 시뮬레이션 함수
function simulateClick(val) {
    const btns = document.querySelectorAll('.button');
    btns.forEach(btn => {
        if (btn.value === val) {
            btn.click();
        }
    });
}
