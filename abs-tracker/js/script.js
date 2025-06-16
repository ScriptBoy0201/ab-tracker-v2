function calculate() {
  const weight = parseFloat(document.getElementById('weight').value);
  const waist = parseFloat(document.getElementById('waist').value);
  const height = parseFloat(document.getElementById('height').value);
  const bf = 495 / (1.0324 - 0.19077 * Math.log10(waist - height * 0.22) + 0.15456 * Math.log10(height)) - 450;
  const bfRounded = bf.toFixed(1);
  document.getElementById('output').innerHTML = `<p><strong>Estimated Body Fat %:</strong> ${bfRounded}%</p>`;
  const file = document.getElementById('photo').files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      document.getElementById('imgPreview').innerHTML = `<img src="${e.target.result}" alt="Progress Photo" />`;
    };
    reader.readAsDataURL(file);
  }
}