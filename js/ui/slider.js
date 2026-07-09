export function initFeedbackSlider(onChange) {
  const slider = document.getElementById('feedbackSlider');
  const value = document.getElementById('feedbackValue');
  const meaning = document.getElementById('feedbackMeaning');
  slider.addEventListener('input', () => {
    const numericValue = Number(slider.value);
    value.textContent = numericValue;
    const item = onChange(numericValue);
    meaning.textContent = item.label;
  });
}
