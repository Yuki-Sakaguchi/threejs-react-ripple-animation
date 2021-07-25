# Three.js + React で波紋のアニメーションを実装する

https://yuki-sakaguchi.github.io/threejs-react-ripple-animation/


# メモ

## まずはプロジェクトを用意

```bash
npx create-react-app [プロジェクト名]
```

## ReactでThree.jsを扱うためのライブラリをインストール

```bash
npm install three react-three-fiber
```

## create-react-appのビルド結果について

- パスを相対パスにするためには `package.json` に `"homepage": "./"` を追加
- ビルドディレクトリ名を変えることはできないので、`prebuild`, `postbuild` などを駆使してファイル名を変更したりする


## 参考

- https://www.youtube.com/watch?v=wRmeFtRkF-8
  - 参考のYoutube
- https://grapher.mathpix.com/
  - 関数で実行されるグラフの結果を確認するサイト

