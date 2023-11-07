<script></script>

<main>
	<body>
		<div class="box">
			<div class="container">
				<div class="container mt-4 mb-5 d-flex justify-content-center" id="inside-box">
					<div class="text-center">
						<p>
							<button type="button" class="btn btn-primary btn-block" id="newQuiz"
								>Create a new quiz</button
							>
						</p>
						<p>
							<button type="button" class="btn btn-primary btn-block" id="quizHistory"
								>See quiz history</button
							>
						</p>
					</div>
				</div>
			</div>
		</div>
	</body>
</main>

<style>
	body {
		background: #7801a8;
	}
	.container {
		margin-top: 7rem;
	}
	#inside-box {
		width: 30rem;
		height: 20rem;
		background: #c49eff;
		box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
		border-radius: 51px;
		padding: 15rem;
		padding-top: 20rem;
	}

	.btn-primary {
		background-color: #f0e9e9;
		border: None;
		color: black;
		font-family: 'Jeju Gothic', sans-serif;
		word-wrap: break-word;
	}

	#newQuiz {
		font-size: 36px;
		font-family: 'Jeju Gothic', sans-serif;
		font-weight: 400;
		text-align: center;
		margin-top: -18rem;
	}
	#quizHistory {
		font-size: 36px;
		font-family: 'Jeju Gothic', sans-serif;
		font-weight: 400;
		margin-top: -2rem;
	}
	.btn {
		width: 20rem;
		height: 6rem;
	}
</style>
