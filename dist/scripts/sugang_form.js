/****************************************************************
 * [수강 폼]
 * 수강 아이템을 나타내는 폼을 찾고 생성하고 삭제하는 함수들입니다.
 ****************************************************************/

function idOfSugangForm(courseId) {
  return `sugang_form_of_${courseId}`;
}

function findExistingSugangForm(courseId) {
  return document.getElementById(idOfSugangForm(courseId));
}

function callSukangResultList(par_haksuNo) {
  $.ajax({
    url: endpoints.submit,
    data: {
      par_haksuNo:par_haksuNo,
      par_type:"insert"
    },
    method: 'post',
    success: function(response) {
        var scriptString = response;
        var match = scriptString.match(/macroChk\([^,]+,[^,]+,\s*"([^"]+)"\)/);
        // 추출된 값 출력
        if (match && match.length > 1) {
            var extractedValue = match[1];
            console.log("추출된 값:", extractedValue);
            callSukangResultListLast(par_haksuNo, extractedValue);
          } else {
              console.log("값 추출 실패");
          }
      }
  })
}

function callSukangResultListLast(par_haksuNo, par_checkval) {
  $.ajax({
    url: endpoints.submit,
    data: {
      par_haksuNo:par_haksuNo,
      par_type:"insert",
      checkVal:par_checkval
    },
    method: 'post'
  })
}

function addSugangForm(courseId, memo) {
  if (findExistingSugangForm(courseId)) {
    console.error('이미 해당 학수번호를 가진 수강 폼이 존재합니다!');
    return;
  }

  console.log(`수강 폼을 하나 생성합니다: (학수번호: ${courseId}, 메모: ${memo})`);

  /**
   * 새로 만들 수강 폼을 식별할 수 있는 id가 필요합니다.
   * 이 id는 나중에 이 폼을 삭제할 때에 폼을 지정하기 위해 사용합니다.
   */
  const newFormId = idOfSugangForm(courseId);

  /**
   * 새로 추가될 수강 폼은 아래 내용으로 이루어집니다.
   */
  const newRowHTML = `
            <!-- 메모 -->
            <div style="font-size: 12px; margin-left: 1px; margin-bottom: -7px;">
                ${memo || '⠀'} <!-- 메모가 없어도 자리는 차지하고 있어야 해요! -->
            </div>

            <!-- 학수번호 폼 -->
            <div>
                <!-- 학수번호 필드 -->
                <input class="col-input" style="flex: 1" name="par_haksuNo" value="입력을 확인해 주세요!">
                <input type="hidden" name="par_type" value="insert">

                <!-- 삭제 버튼 -->
                <button
                    class="col-button plain-button"
                    type="button"
                    onclick="removeSugangForm('${courseId}')">
                    X
                </button>

                <!-- 신청 버튼 -->
                <button
                    class="col-button green-button"
                    type="submit"
                    onclick="callSukangResultList('${courseId}')">
                    신청(새 창)
                </button>
            </div>
  `;

  /**
   * 요걸 div로 한번 감쌉니다.
   */
  const newRowWrapper = document.createElement('div');
  newRowWrapper.id = newFormId;
  newRowWrapper.innerHTML = newRowHTML;
  newRowWrapper.classList.add('opacity-transition');

  /**
   * 학수번호 값을 집어넣어 줍니다.
   * 위의 HTML에서 par_haksuNo input의 value에다가 ${courseId} 이런식으로 넣어줄 수도 있지만,
   * 그렇게 하면 원치 않는 escape가 생길 수 있기 때문에 이렇게 프로그래밍적으로 합니다.
   */
   newRowWrapper
    .getElementsByTagName('div')
    .item(1)
    .getElementsByTagName("input")
    .item(0)
    .setAttribute("value", courseId);

  /**
   * 만든 수강 폼을 DOM에 추가해줍니다.
   */
  document.getElementById('sugangFormRows').appendChild(newRowWrapper);

  /**
   * 수강 폼을 fade-in 합니다.
   * DOM 추가 직후에 opacity를 설정하면 transition이 작동하지 않기 때문에
   * setTimeout을 사용합니다.
   */
  setTimeout(() => {
    newRowWrapper.style.opacity = '1';
  }, 0);
}

function removeSugangForm(courseId) {
  const element = findExistingSugangForm(courseId);

  element.parentElement.removeChild(element);
}

function notifyResult(message) {
  const formResult = document.getElementById('addFormResult')

  formResult.innerText = message;
  formResult.style.lineHeight = '1.8';

  setTimeout(() => {
    formResult.style.lineHeight = '0';
  }, 2200);
}