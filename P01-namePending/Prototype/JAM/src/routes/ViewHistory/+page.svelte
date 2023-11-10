<script>
	// Your script here
</script>

<main>
  <body>
    <div class="view-history">
      <div class="overlap-group-wrapper">
        <div class="overlap-group">
          <img class="polygon" alt="Polygon" src="polygon-8.svg" />
          <img class="img" alt="Polygon" src="polygon-7.svg" />
          <div class="back-to-home-box">Back to Home</div>
          <div class="history-container">
            <div class="centered-text">History</div>
            <div class="search-bar">
              <input type="text" placeholder="Search by ID or Name" />
            </div>
            <div class="purple-rectangle">
              <div class="container">
                <div class="box" style="margin-left: 10px">Date</div>
                <div class="box2" style="margin-left: 10px">Quiz Status</div>
              </div>
              <div class="container">
                <div class="box" style="margin-left: 10px">1/11/2023</div>
                <div class="box2" style="margin-left: 10px">
                  <div class="green-box">Correct Answers: 6</div>
                  <div class="red-box">Wrong Answers: 3</div>
                  <div class="maroon-box">View Details</div>
                </div>
              </div>
              <div class="container">
                <div class="box" style="margin-left: 10px">1/11/2023</div>
                <div class="box2" style="margin-left: 10px">
                  <div class="green-box">Correct Answers: 3</div>
                  <div class="red-box">Wrong Answers: 5</div>
                  <div class="maroon-box">View Details</div>
                </div>
              </div>
              <div class="container">
                <div class="box" style="margin-left: 10px">29/10/2023</div>
                <div class="box2" style="margin-left: 10px">
                  <div class="green-box">Correct Answers: 8</div>
                  <div class="red-box">Wrong Answers: 2</div>
                  <div class="maroon-box">View Details</div>
                </div>
              </div>
              <div class="container">
                <div class="box" style="margin-left: 10px">29/11/2023</div>
                <div class="box2" style="margin-left: 10px">
                  <div class="green-box">Correct Answers: 2</div>
                  <div class="red-box">Wrong Answers: 5</div>
                  <div class="maroon-box">View Details</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </body>
</main>

<style>
  .view-history {
    background-color: #7801a8;
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 100%;
  }

  .view-history .overlap-group-wrapper {
    background-color: #7801a8;
    height: 1024px;
    width: 1440px;
  }

  .view-history .overlap-group {
    height: 1024px;
    position: relative;
  }

  .container {
    display: flex;
  }

  .view-history .polygon {
    height: 236px;
    left: 1164px;
    position: absolute;
    top: 788px;
    width: 276px;
  }

  .view-history .img {
    height: 1024px;
    left: 0;
    position: absolute;
    top: 45px;
    width: 1440px;
  }

  .history-container {
    position: absolute;
    top: 150px;
    width: 100%;
    text-align: center;
  }

  .centered-text {
    color: #ffffff;
    font-family: "JejuGothic-Regular", Helvetica;
    font-size: 36px;
    font-weight: 400;
    margin-bottom: 20px;
  }

  .search-bar input {
    width: 300px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }

  .purple-rectangle {
    background-color: #cd92e4;
    height: 500px;
    width: 100%;
  }

  .box {
    background-color: #f7f6f6;
    border-radius: 1px;
    color: #000000;
    cursor: pointer;
    font-size: 24px;
    padding: 10px;
    text-align: center;
    margin: 15px;
    width: 200px;
  }

  .box2 {
    display: flex;
    background-color: #f7f6f6;
    border-radius: 1px;
    text-align: center;
    color: #000000;
    cursor: pointer;
    font-size: 24px;
    padding: 10px;
    text-align: center;
    margin: 15px;
    width: 1100px;
    flex: 1;
  }

  .red-box {
    background-color: red;
    border-radius: 10px;
    height: 30px;
    width: 500px;
  }

  .green-box {
    background-color: green;
    border-radius: 10px;
    height: 30px;
    width: 500px;
  }

  .maroon-box {
    background-color: maroon;
    height: 30px;
    width: 200px;
    border-radius: 10px;
  }

  .back-to-home-box {
    background-color: #f7f6f6;
    width: 150px;
    margin-left: 1250px;
    margin-top: 10px;
    text-align: center;
    border-radius: 5px;
    height: 30px;
  }
</style>
