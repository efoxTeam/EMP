# EMP3 React18 DEMO with base config

本`demo`主要展示，`EMP3.0`基站项目部署在非根目录环境时，作为消费者的应用获取远程模块资源地址`前缀`异常的问题。

[官网相关配置说明](https://empjs.dev/plugin/tool/share.html#getpublicpath)

## 运行
```
pnpm i
pnpm dev
```

## 发现问题
访问`http://localhost:1801/`可在控制台看到以下报错:

```
GET http://localhost:1801/output/emp.js net::ERR_ABORTED 404
```
实际上正确的`host`地址应该是 `http://localhost:1802/output/emp.js`。

## 分析原因

查看`host`项目的`emp.config.ts`

`react-host-with-base-config` / `emp.config.ts`:

```ts title="react-host-with-base-config/emp.config.ts"
import {defineConfig} from '@empjs/cli'
...
export default defineConfig(store => {
  return {
    ...
    base: '/output/',
    ...
  }
})
```
由于项目需要，基站的访问地址需要在二级目录`/output/`，使用了[base配置项](https://empjs.dev/config/base/base.html)。

但配置了`base`项后，影响了消费者(`react-app`)加载基站资源的地址策略，从原来使用基站的Host，改为使用`base`配置项的值作为资源前缀，则`/output/`的相对目录。

## 解决问题

为了`修正消费者加载基站其他资源的前缀问题`，需要在基站项目`pluginRspackEmpShare`项中，额外添加`getPublicPath`配置项。

修改`host`项目的`emp.config.ts`，添加`pluginRspackEmpShare` 的 `getPublicPath`配置。

`react-host-with-base-config` / `emp.config.ts`:

```ts title="react-host-with-base-config/emp.config.ts"
import {defineConfig} from '@empjs/cli'
import {pluginRspackEmpShare} from '@empjs/share'
export default defineConfig(store => {
  return {
    plugins: [
      ...
      pluginRspackEmpShare({
        ...
        getPublicPath: `return "http://localhost:1802/output/"`,
        ...
      }),
    ],
    ...
  }
})
```

## 查看结果
```
pnpm i
pnpm dev
```
访问`http://localhost:1801/`，此时看到基站资源可以被正确加载。

[官网相关配置说明](https://empjs.dev/plugin/tool/share.html#getpublicpath)

