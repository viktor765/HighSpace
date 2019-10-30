'use strict';

/*function checkBulletCollision(delta) {
	if (player.bullets[0]) {
		for (var i = 0; i < player.bullets.length; i++) {
			for (var j = 0; j < enemies.length; j++) {
				if (player.bullets[i].rect.intersects(enemies[j].rect)) {
					enemies[j].explode();
					
					playSound('sfx/explosion.wav')

					if (Math.random() < bonusSpawnChance * delta) {
						var index = Math.floor(Math.random() * bonusConstructors.length);
						mapBonuses.push(new bonusConstructors[index](enemies[j].rect.x, enemies[j].rect.y));
					}

					player.bullets.removeAt(i);
					enemies.removeAt(j);

					player.points++;

					break;
				}
			}
		}
	}
}*/

