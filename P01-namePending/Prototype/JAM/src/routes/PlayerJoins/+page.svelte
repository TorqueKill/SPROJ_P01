<script></script>

<main>
	<body>
		<div class="container">
			<div class="container mt-4 mb-5 d-flex justify-content-center" id="inside-box">
				<p id="joinText">Join a room</p>
				<div class="form-group">
					<input type="text" class="form-control" id="displayName" placeholder="Enter room ID" />
				</div>
				<p>
					<button type="button" class="btn btn-primary btn-block" id="joinQuiz">Join</button>
				</p>
			</div>
		</div>
	</body>
</main>

<style>
	body {
		background: #7801a8;
	}
	.container {
		margin-top: 13rem;
	}
	#inside-box {
		width: 25rem;
		height: 25rem;
		background: #c49eff;
		box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
		border-radius: 51px;
		padding-top: 6rem;
	}
	#joinText {
		color: white;
		font-size: 40px;
		font-family: JejuGothic;
		font-weight: 400;
		width: 200rem;
		margin-top: -4rem;
		margin-left: 5.5rem;
		margin-right: -50rem;
	}
	.btn {
		margin-top: 10rem;
		margin-left: -15rem;
		margin-right: 6rem;
		width: 6rem;
		background: #f0e9e9;
		border: None;
		color: black;
		font-family: JejuGothic;
	}
	.btn:active {
		background-color: #7801a8;
		color: #f0e9e9;
	}
	.form-control {
		color: black;
		width: 20rem;
		margin-top: 4rem;
		margin-left: -5rem;
		margin-right: 1.5rem;
		background: #f0e9e9;
		border: None;
		border-radius: 6px;
		font-family: JejuGothic;
	}
</style>
