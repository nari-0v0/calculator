// html 요소선택
const history = document.querySelector('.history'); //document html 을 분해한거, 그래서 .querySelecter는 하나의 요소만 들고옴
const log = document.querySelector('.log');
const button = document.querySelectorAll('.button'); // .querySelectorAll 모든 일치요소 들고옴

// 상태 변수 (계속 유지 되어야하므로 바깥에 선언)
let firstOperand = null; //첫번째 숫자 기본값
let operator = null;  // 연산자 기본값
let shouldReset = false; //초기화 기본값 (초기화안함)
let historyText = ''; // history 기본값

// 버튼 이벤트 등록
for (let i = 0; i < button.length; i++) {
    const btn = button[i];
    const val = btn.value; //btn의 value프로퍼티값을 val이라는 변수에 담는다
    // console.log(btn.value);
    //버튼의 갯수에 넘버를 붙여서 그 넘버에 해당하는 .value값을 가져온다
    // value 값을 쓰는 이유 : 실제로 사용할 값 분리, 일관된 타입보장, 폼제출시 편리, 유지보수편리, 

    //클릭시 반환값
    btn.addEventListener('click', () => { //addEventListener : DOM요소에 이벤트를 등록하는 메서드 / 익명함수 : 이름이 없는 함수. 한번만 쓰이는 짧은 로직에 자주사용
        // console.log(val);
        //메서드(함수) : 객체에 소속된 함수 / 객체 : 키:값이 합쳐진 자료구조 / 프로퍼티(데이터) : 값이 들어있는 일반 키
        //버튼을 클릭하면 버튼.value값을 val로 가져온다

        // 초기화
        if (val === 'C') {
            log.textContent = '0';
            history.textContent = '0';
            historyText = '0';
            firstOperand = null;
            operator = null;
            shouldReset = false;
            return;
        }
        //클릭한게 C이면 log.textContent를 0으로 반환한다.

        // 소수점 입력
        if (val === '.') {
            if (!log.textContent.includes('.')) {//includes : 참과 거짓을 판별하는 메서드 디스플레이에 텍스트가 .이 붙지않을경우 문자열 뒤에 .을 붙인다
                log.textContent += '.'; //소수점이 없을경우 추가
                historyText += '.';
                history.textContent = historyText; //history요소의 화면에 보이는 글자를 historyText 변수에 담긴 값으로 변경
            }
            shouldReset = false;
            return;
        }

        // 하나씩 지우기 (Backspace)
        if (val === '⇦') {
            // log에서 마지막 문자 제거
            log.textContent = log.textContent.slice(0, -1);
            if (log.textContent === '') log.textContent = '0';

            // history에서도 마지막 문자 제거
            historyText = historyText.slice(0, -1);
            history.textContent = historyText;
            return;
        }

        // 사칙연산 처리
        if (btn.classList.contains('operator')) { //아래 숫자입력에서 숫자가 입력되고 연산자를 누르면
            const currentValue = parseFloat(log.textContent);// 현재 값 저장 / parsFloat : 문자열을 숫자로 바꿔주는 함수

            //첫번째 값이 있고, 연산자가 있고, 리셋상태가 아닐경우(1+2에서 또 연산자를 누른 경우))
            if (firstOperand !== null && operator !== null && !shouldReset) {
                const result = calculate(firstOperand, operator, currentValue); //계산한다
                log.textContent = String(result); // 계산한걸 문자열로 가져오고 디스플레이에 보여준다  string을 쓰는이유 : 타입안정성 때문.
                firstOperand = result; //다음 연산을 위해 첫번째값에 계산한 값을 넣는다
            } else { // 첫번째값이 없거나, 연산자도 없거나, 리셋상태 일경우
                firstOperand = currentValue; // 지금 입력된 값을 첫번째 값으로 저장
            }

            operator = val; //연산자 저장
            historyText += `${val}`; // 히스토리에 적힐 연산자 저장
            history.textContent = historyText; // 히스토리텍스트에 입력된 걸 디스플레이에 보여줌
            shouldReset = true; //초기화
            console.log(`firstOperand : ${firstOperand} \nOperator : ${operator}`);
            return;
        }

        //괄호 (조금더 고민)
        // if (val === '(' || val === ')') {
        //     historyText += val;
        //     history.textContent = historyText;
        //     return;
        // }

        //마이너스 
        if (val === '-') { //마이너스가 눌렸을때
            if (!log.textContent.includes('-')) { //마이너스가 눌린적이 없으면
                log.textContent = String(parseFloat(log.textContent) * -1) //-1을 곱해준 후 문자열로 변경
            }
            shouldReset = false //초기화 안함
            history.textContent = historyText; // 받은 값을 디스플레이에 넘겨줌
            return;
        }

        //부호+- 
        if (val === '±') { //부호바꾸기 눌리면
            if (!log.textContent.includes('0')) { //로그가 0이 아니면
                log.textContent = String(parseFloat(log.textContent) * -1); //-1을 곱해준 후 문자열로 변경
            }
            shouldReset = false; // 초기화 안함 . 다음값 입력되어야하기때문에 초기화 안함

            history.textContent = historyText; // 받은 값을 디스플레이에 넘겨줌
            return;
        }

        //백분율% history 다시확인
        if (val === '%') { //퍼센트 눌리면
            log.textContent = String(parseFloat(log.textContent) / 100); //100으로 나눠준 후 문자열로 변경
            shouldReset = true; // 초기화. 이후에 눌리는 값 없어야 정확한 계산이 되기 때문에 다음버튼 누르는건 초기화 해줘야함

            history.textContent = historyText;// 받은 값을 디스플레이에 넘겨줌
            return;
        }

        // 계산 실행
        if (val === '=') { //=을 누르면
            if (firstOperand !== null && operator !== null) { //첫번째 값이 입력됐고, 연산자가 입력됐으면
                const secondOperand = parseFloat(log.textContent); //적혀있는 값을 정수로 바꿔준걸 두번째 값에 넣어준다
                const result = calculate(firstOperand, operator, secondOperand); // 계산한다
                log.textContent = String(result); // 계산한 값을 문자열로 돌리고 디스플레이에 보여준다
                historyText += `=${result}`; // 계산한 값을 저장한다
                history.textContent = historyText;// 받은 값을 디스플레이에 넘겨줌
                firstOperand = null; //첫번째값 초기화
                operator = null; // 연산자 초기화
                shouldReset = true; //초기화 다음 입력하는 값이 새로 입력되도록함.
                historyText = '0'; //히스토리 텍스트는 0
                console.log(`secondOperand : ${secondOperand} \nvalue : ${val} \nresult : ${result}`);
            }
            return;
        }

        // 숫자 입력
        if (!btn.classList.contains('number')) return; //숫자가 입력되지 않으면 종료한다.

        //디스플레이에 값이 0이거나 초기화상태이면 입력값을 표현한다
        if (log.textContent === '0' || shouldReset) {
            log.textContent = val;

            // 히스토리 초기상태거나, 리셋상태 일때 입력값을 표현한다
            if (history.textContent === '0' || history.textContent === 'history' || shouldReset) {
                historyText = val;
            }

            shouldReset = false;

        } else {
            log.textContent += val;
            historyText += val;
        }

        history.textContent = historyText;
        return;
    });
}

// 사칙연산 계산함수
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

