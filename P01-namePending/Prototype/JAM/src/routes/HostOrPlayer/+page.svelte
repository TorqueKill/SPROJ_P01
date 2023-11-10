<script></script>

<main>
  <body>
    <div class="host-or-player">
      <div class="overlap-group-wrapper">
        <div class="overlap-group">
          <img class="polygon" alt="Polygon" src="polygon-8.svg" />
          <img class="img" alt="Polygon" src="polygon-7.svg" />
          <div class="rectangle">
            <div class="mode-box" style="margin-left: 160px; margin-top: 40px">Host Mode</div>
            <div class="mode-box" style="margin-left: 160px; margin-top: 160px">Player Mode</div>
          </div> 
        </div>
      </div>
    </div>
  </body>
</main>

<style>
  .host-or-player {
    background-color: #7801a8;
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 100%;
  }

  .host-or-player .overlap-group-wrapper {
    background-color: #7801a8;
    height: 1024px;
    width: 1440px;
  }

  .host-or-player .overlap-group {
    height: 1024px;
    position: relative;
  }

  .host-or-player .polygon {
    height: 236px;
    left: 1164px;
    position: absolute;
    top: 788px;
    width: 276px;
  }

  .host-or-player .img {
    height: 1024px;
    left: 0;
    position: absolute;
    top: 0;
    width: 1440px;
  }

  .host-or-player .rectangle {
    background-color: #c49eff;
    border-radius: 54px;
    height: 443px;
    left: 392px;
    position: absolute;
    top: 224px;
    width: 657px;
  }

  .mode-box {
    background-color: #f7f6f6;
    border-radius: 15px;
    color: #000000;
    cursor: pointer;
    font-size: 24px;
    padding: 20px;
    text-align: center;
    margin: 15px;
    width: 300px;
  }
</style>
