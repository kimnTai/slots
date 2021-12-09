import { Container, Sprite, Text } from "pixi.js";
import { gsap } from "gsap";
import { app } from "../component/app";

/**各種特效 */
class ShowEvent {
  /**更新血量 */
  static updateHP(name: string, before: number, after: number): Promise<void> {
    return new Promise((resolve) => {
      if (before == after) {
        resolve;
      }
      const container = app.stage.getChildByName(name) as Container;
      const HPtext = container.children[2] as Text;
      const counter = { score: before };
      gsap.to(counter, {
        duration: 1,
        score: after,
        onUpdate(): void {
          HPtext.text = `${name} : ${counter.score.toFixed(0)}`;
        },
        onComplete: resolve,
      });
    });
  }
  /**死亡特效 */
  static death(name: string): Promise<string> {
    const container = app.stage.getChildByName(name) as Container;
    const speed = 2;
    let counter = 0;
    let sign = 1;
    return new Promise((resolve) => {
      // 玩家死亡 => sign 逆時針方向
      if (name == "玩家") {
        sign = -1;
      }
      app.ticker.add(p1);
      /**角色轉 90度， */
      function p1() {
        container.children[0].angle += speed * sign;
        counter++;
        if (counter == 90 / speed) {
          app.ticker.remove(p1);
          resolve("已完成");
        }
      }
    });
  }
  /**暈眩特效 */
  static showDizzy(name: string): Promise<string> {
    const container = app.stage.getChildByName(name) as Container;
    const speed = 2;
    let counter = 0;
    let sign = 1;
    return new Promise((resolve) => {
      app.ticker.add(p1);
      /**順時針轉30度 -> 逆時針轉60度 -> 順時針轉30度 */
      function p1() {
        container.children[0].angle += speed * sign;
        counter++;
        if (counter == 30 / speed) {
          sign *= -1;
        } else if (counter == 90 / speed) {
          sign *= -1;
        } else if (counter == 120 / speed) {
          app.ticker.remove(p1);
          resolve("已完成");
        }
      }
    });
  }
  /**普通攻擊特效 */
  static showAttack(name: string): Promise<string> {
    const attacker = app.stage.getChildByName(name) as Container;
    let sign = 1;
    if (name == "電腦") {
      sign = -1;
    }
    return new Promise((resolve) => {
      /**向前移動 */
      gsap.to(attacker.children[0], {
        duration: 0.5,
        x: 200 * sign,
        repeat: 1,
        yoyo: true,
        onComplete: resolve,
      });
    });
  }
  /** 格檔特效 */
  static showShield(name: string): Promise<string> {
    const shield = Sprite.from("Shield.png");
    let sign = 1;
    if (name == "電腦") {
      sign = -1;
    }
    shield.anchor.set(0.5, 0.5);
    shield.position.set(510 - 100 * sign, 270);
    app.stage.addChild(shield);
    return new Promise((resolve) => {
      gsap.to(shield, {
        duration: 1,
        onComplete: () => {
          app.stage.removeChild(shield);
          resolve("已完成");
        },
      });
    });
  }
  /** Miss 特效 */
  static showMiss(name: string): Promise<string> {
    const miss = Sprite.from("miss.png");
    let sign = 1;
    if (name == "電腦") {
      sign = -1;
    }
    const defenser = app.stage.getChildByName(name) as Container;
    miss.anchor.set(0.5, 0.5);
    miss.position.set(510 - 100 * sign, 270);
    return new Promise((resolve) => {
      const tl = gsap.timeline();
      tl.to(defenser.children[0], {
        duration: 0.5,
        x: -100 * sign,
        repeat: 1,
        yoyo: true,
        onComplete: () => {
          resolve("已完成");
        },
      })
        .to(
          miss,
          {
            onComplete: () => {
              app.stage.addChild(miss);
            },
          },
          0.1
        )
        .to(miss, {
          duration: 0.5,
          y: "-=50",
          onComplete: () => {
            app.stage.removeChild(miss);
          },
        });
    });
  }
  /** 連擊特效 */
  static showDouble(name: string): Promise<string> {
    const attacker = app.stage.getChildByName(name) as Container;
    const double = Sprite.from("Double.png");
    let sign = -1;
    if (name == "玩家") {
      sign = 1;
    }
    double.anchor.set(0.5, 0.5);
    double.scale.x = -1 * sign;
    double.position.set(510 + 100 * sign, 270);
    return new Promise((resolve) => {
      gsap.to(attacker.children[0], {
        keyframes: [
          {
            duration: 0.4,
            x: 200 * sign,
            onComplete: () => {
              app.stage.addChild(double);
            },
          },
          {
            duration: 0.15,
            x: `+=${-100 * sign}`,
            repeat: 1,
            yoyo: true,
          },
          {
            duration: 0.4,
            x: 0,
            onComplete: () => {
              app.stage.removeChild(double);
              resolve("已完成");
            },
          },
        ],
      });
    });
  }
  /**火球特效 */
  static showFireBall(name: string): Promise<string> {
    const fireBall = Sprite.from("FireBall.png");
    let sign = 1;
    if (name == "玩家") {
      sign = -1;
    }
    fireBall.anchor.set(0.5, 0.5);
    fireBall.scale.x = sign;
    // 起始玩家 x = 410，電腦 x = 610
    fireBall.position.set(510 + 100 * sign, 270);
    return new Promise((resolve) => {
      app.stage.addChild(fireBall);
      gsap.to(fireBall, {
        duration: 0.5,
        x: 510 - 100 * sign,
        onComplete: () => {
          app.stage.removeChild(fireBall);
          resolve("已完成");
        },
      });
    });
  }
}

export { ShowEvent };
