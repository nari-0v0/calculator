// html 요소선택
const history = document.querySelector('.history');
const log = document.querySelector('.log');
const button = document.querySelectorAll('.button');

// 상태 변수
let firstOperand = null;
let operator = null;
let shouldReset = false;
let historyText = '';

// 버튼 이벤트 등록
for (let i = 0; i < button.length; i++) {
    const btn = button[i];
    const val = btn.value;

    btn.addEventListener('click', () => {

        // 초기화
        if (val === 'C') {
            log.textContent = '0';
            history.textContent = '';
            historyText = '';
            firstOperand = null;
            operator = null;
            shouldReset = false;
            return;
        }

        // 소수점 입력
        if (val === '.') {
            if (!log.textContent.includes('.')) {
                log.textContent += '.';
                historyText += '.';
                history.textContent = historyText;
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
        if (btn.classList.contains('operator')) {
            const currentValue = parseFloat(log.textContent);

            if (firstOperand !== null && operator !== null && !shouldReset) {
                const result = calculate(firstOperand, operator, currentValue);
                log.textContent = String(result);
                firstOperand = result;
            } else {
                firstOperand = currentValue;
            }

            operator = val;
            historyText += `${val}`;
            history.textContent = historyText;
            shouldReset = true;
            console.log(`firstOperand : ${firstOperand} \nOperator : ${operator}`);
            return;
        }

        //괄호
        if (val === '(' || val === ')') {
            historyText += val;
            history.textContent = historyText;
            return;
        }

        //부호+- history 다시 확인
        if (val === '±') {
            if (log.textContent !== '0') {
                log.textContent = String(parseFloat(log.textContent) * -1);
            }
            shouldReset = false;

            history.textContent = historyText;
            return;
        }

        //백분율% history 다시확인
        if (val === '%') {
            log.textContent = String(parseFloat(log.textContent) / 100);
            shouldReset = true;

            history.textContent = historyText;
            return;
        }

        // 계산 실행
        if (val === '=') {
            if (firstOperand !== null && operator !== null) {
                const secondOperand = parseFloat(log.textContent);
                const result = calculate(firstOperand, operator, secondOperand);
                log.textContent = String(result);
                historyText += `=${result}`;
                history.textContent = historyText;
                firstOperand = null;
                operator = null;
                shouldReset = true;
                historyText = '0';
                console.log(`secondOperand : ${secondOperand} \nvalue : ${val} \nresult : ${result}`);
            }
            return;
        }

        // 숫자 입력
        if (!btn.classList.contains('number')) return;

        if (log.textContent === '0' || shouldReset) {
            log.textContent = val;
            shouldReset = false;
        } else {
            log.textContent += val;
        }
        historyText += val;
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

