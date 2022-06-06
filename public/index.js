document.addEventListener('DOMContentLoaded', () => {

	////////////////////////////////////////////////////
	//Cosmetic appearance of login screen
	////////////////////////////////////////////////////

	window.onresize = onWindowResize

	let scene, camera, renderer, starGeo, stars, rocketGeo, rockets, humanGeo, humans;

	function init() {
		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
		camera.position.z = 1;
		camera.rotation.x = Math.PI / 2;

		renderer = new THREE.WebGLRenderer();
		renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(renderer.domElement);

		// star 
		starGeo = new THREE.Geometry();
		for (let i = 0; i < 6000; i++) {
			star = new THREE.Vector3(
				Math.random() * 600 - 300,
				Math.random() * 600 - 300,
				Math.random() * 600 - 300
			);
			star.velocity = 0;
			star.acceleration = 0.0015;
			starGeo.vertices.push(star);
		}
		let spriteStar = new THREE.TextureLoader().load('/assets/images/star.png')
		let starMaterial = new THREE.PointsMaterial({
			color: 0xaaaaaa,
			size: 0.7,
			map: spriteStar
		})

		// rocket
		rocketGeo = new THREE.Geometry();
		for (let i = 0; i < 17; i++) {
			rocket = new THREE.Vector3(
				Math.random() * 600 - 300,
				Math.random() * 600 - 300,
				Math.random() * 600 - 300
			);
			rocket.velocity = 0;
			rocket.acceleration = 0.01;
			rocketGeo.vertices.push(rocket);
		}
		let spriteRocket = new THREE.TextureLoader().load('/assets/images/rocket.png')
		let rocketMaterial = new THREE.PointsMaterial({
			color: 0xaaaaaa,
			size: 20,
			map: spriteRocket
		})

		// human
		humanGeo = new THREE.Geometry();
		for (let i = 0; i < 3; i++) {
			human = new THREE.Vector3(
				Math.random() * 600 - 300,
				Math.random() * 600 - 300,
				Math.random() * 600 - 300
			);
			human.velocity = 0;
			human.acceleration = 0.005;
			humanGeo.vertices.push(human);
		}
		let spriteHuman = new THREE.TextureLoader().load('/assets/images/human.png')
		let humanMaterial = new THREE.PointsMaterial({
			color: 0xaaaaaa,
			size: 40,
			map: spriteHuman
		})

		// create and animate
		stars = new THREE.Points(starGeo, starMaterial);
		scene.add(stars)
		rockets = new THREE.Points(rocketGeo, rocketMaterial);
		scene.add(rockets)
		humans = new THREE.Points(humanGeo, humanMaterial);
		scene.add(humans)
		animate();
	}

	function onWindowResize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	}

	function animate() {
		// stars
		starGeo.vertices.forEach(p => {
			p.velocity += p.acceleration;
			p.y -= p.velocity;
			if (p.y < - 200) {
				p.y = 200;
				p.velocity = 0;
			}
		})
		starGeo.verticesNeedUpdate = true;
		stars.rotation.y += 0.0015;

		// rockets
		rocketGeo.vertices.forEach(p => {
			p.velocity += p.acceleration;
			p.y -= p.velocity;
			if (p.y < - 200) {
				p.y = 200;
				p.velocity = 0;
			}
		})
		rocketGeo.verticesNeedUpdate = true;
		rockets.rotation.y += 0.0001;

		// humans
		humanGeo.vertices.forEach(p => {
			p.velocity += p.acceleration;
			p.y -= p.velocity;
			if (p.y < - 200) {
				p.y = 200;
				p.velocity = 0;
			}
		})
		humanGeo.verticesNeedUpdate = true;
		humans.rotation.y += 0.0004;

		renderer.render(scene, camera);
		requestAnimationFrame(animate);
	}

	init()
	onWindowResize()

});
