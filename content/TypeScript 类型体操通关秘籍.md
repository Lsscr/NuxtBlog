---
Title: TypeScript 类型体操通关秘籍
tag:
- projects
- TypeScript
created: 2023-01-11 17:01
modification date: 星期三 11日 一月 2023 17:01:04
category: 学习,阅读
starts: 5星级
status: 写作中
---


# TypeScript 类型体操通关秘籍

## 科普

### 什么是类型检查?
> **如果能保证对某种类型只做该类型允许的操作，这就叫做`类型安全`**。**类型检查是为了保证类型安全的**。
> 类型检查可以在运行时做。
> 可以运行之前的编译期做。

### 动态类型检查与静态类型检查？
> `动态类型检查` 在源码中不保留类型信息，对某个变量赋什么值、做什么操作都是允许的，写代码很灵活。但这也埋下了类型不安全的隐患，比如对 string 做了乘除，对 Date 对象调用了 exec 方法，这些都是运行时才能检查出来的错误。
> `静态类型检查`则是在源码中保留类型信息，声明变量要指定类型，对变量做的操作要和类型匹配，会有专门的编译器在编译期间做检查。

**动态类型只适合简单的场景，对于大项目却不太合适，因为代码中可能藏着的隐患太多了，万一线上报一个类型不匹配的错误，那可能就是大问题。**

**而静态类型虽然会增加写代码的成本，但是却能更好的保证代码的健壮性，减少 Bug 率。**

所以，**大型项目注定会用静态类型语言开发。**

### TypeScript 给 JavaScript进行类型检查？
通过 TS Compiler 编译为 JS，编译的过程做类型检查。
它并没有改变 JavaScript 的语法，只是在 JS 的基础上添加了类型语法，所以被叫做 JavaScript 的超集。
TypeScript 类型系统又分为 `简单类型系统` 与 `支持泛型的类型系统`与`支持类型编程的类型系统`

简单类型系统是基础的类型系统，能保证类型安全，但有些死板。所有就有了支持泛型的类型系统，泛型的英文是 Generic Type，也叫做**类型参数**。（其实就是一个类型变量）

支持类型编程的类型系统
**对传入的类型参数（泛型）做各种逻辑运算，产生新的类型，这就是类型编程。**
所以把TS 的类型编程戏称为`类型体操`了。

### TypeScript 类型系统中的类型
TS 类型系统中肯定要把 JS 的运行时类型拿过来
基本类型：number、boolean、string、object、bigint、symbol、undefined、null
包装类型：Number、Boolean、String、Object、Symbol
复合类型：class、Array，**元组（Tuple）、接口（Interface）、枚举（Enum）**

`元组（Tuple）`就是元素个数和类型固定的数组类型：
```typescript
type Tuple = [number, string];
```

`接口（Interface）`可以描述函数、对象、构造器的结构：

`枚举（Enum）`是一系列值的复合：

#### 索引签名
对象可以**动态添加属性**，如果不知道会有什么属性，可以用可索引签名：
```typescript
interface IPerson {
    [prop: string]: string | number;
}
const obj:IPerson = {};
obj.name = 'guang';
obj.age = 18;
```

#### 类型装饰
是否可选，是否只读等：
```typescript
interface IPerson {
    readonly name: string;
    age?: number;
}

type tuple = [string, number?];
```

### TypeScript 类型系统中的类型运算

#### 条件：extends ? :
TypeScript 里的条件判断是 `extends ? :`，叫做条件类型（Conditional Type）比如：
```typescript
type res = 1 extends 2 ? true : false;
```

这种类型也叫做`高级类型`。
> **高级类型的特点是传入类型参数，经过一系列类型运算逻辑后，返回新的类型。**

#### 推导：infer
如何提取类型的一部分呢？答案是 infer。

比如提取元组类型的第一个元素：
```typescript
type First<Tuple extends unknown[]> = Tuple extends [infer T,...infer R] ? T : never;

type res = First<[1,2,3]>;
```

#### 联合：｜
联合类型（Union）类似 js 里的或运算符 |，但是作用于类型，代表类型可以是几个类型之一。
```typescript
type Union = 1 | 2 | 3;
```

#### 交叉：&
交叉类型（Intersection）类似 js 中的与运算符 &，但是作用于类型，代表对类型做合并。
```typescript
type ObjType = {a: number } & {c: boolean};
```

#### 映射类型
```typescript
type MapType<T> = {
  [Key in keyof T]?: T[Key]
}
```

keyof T 是查询索引类型中所有的索引，叫做`索引查询`。

T[Key] 是取索引类型某个索引的值，叫做`索引访问`。

in 是用于遍历联合类型的运算符。

##### 值的变化
比如我们把一个索引类型的值变成 3 个元素的数组：
```typescript
type MapType<T> = {
    [Key in keyof T]: [T[Key], T[Key], T[Key]]
}

type res = MapType<{a: 1, b: 2}>;
```
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b8c462c6120348d0bdd00afbaa58727c~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

##### 索引的变化
用 as 运算符，叫做`重映射`。
```typescript
type MapType<T> = {
    [
        Key in keyof T 
            as `${Key & string}${Key & string}${Key & string}`
    ]: [T[Key], T[Key], T[Key]]
}
```
我们用 as 把索引也做了修改，改成了 3 个 key 重复：
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1240af0a478640cdbc7fa364045eefaf~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)
> 索引类型（对象、class 等）可以用 string、number 和 symbol 作为 key，这里 keyof T 取出的索引就是 string | number | symbol 的联合类型，和 string 取交叉部分就只剩下 string 了。就像前面所说，交叉类型会把同一类型做合并，不同类型舍弃。

## 六个套路
使用 extends 字段约束类型限制
提取部分参数需要用到 infer 字段
-   **never** 代表不可达，比如函数抛异常的时候，返回值就是 never。

### 套路一:模式匹配做提取
**思路:** 就是利用解构的方式,拿到数据里的内容,正如匹配一样

**Typescript 类型的模式匹配是通过 extends 对类型参数做匹配，结果保存到通过 infer 声明的局部类型变量里，如果匹配就能从该局部变量里拿到提取出的类型。**

#### 数组类型

##### First
提取数组第一个元素
``` ts
type getFirst<Arr extends unknown[]> = Arr extends [infer first,... unknown[]] : first ? never;
```

##### Last
提取数组最后一个元素
``` ts
type getLast<Arr extends unknown[]> = Arr extends [...unknown[],infer last] : last ? never;
```

##### PopArr
去除数组最后一个元素(去除要判断是否为空数组)
``` ts
type PopArr<Arr extends unknown[]> = Arr extends [] ? [] : Arr extends [...infer rest,unknown] ?
rest : never;
```

##### ShiftArr
去除数组第一个元素(去除要判断是否为空数组)
``` ts
type ShiftArr<Arr extends unknown[]> = Arr extends [] ? [] : Arr extends  [unknown,...infet rest] ? rest : never;
```


#### 字符串类型

##### StartsWith
判断字符串是否以某个前缀开头
``` ts
type StartsWith<Str extends string,Prefix extends string> = Str extends `${Prefix}${Str}` ? true : false;
``` 

##### Replace
实现字符串替换
``` ts
type strReplace<Str extends string,To extends string,From extends string> = Str extends `${infer Prefix}${To}${infer Rest}` ? `${Prefix}${From}${Rest}` : Str;
```

##### Trim
匹配和替换字符串，那也就能实现去掉空白字符的 Trim
不过因为我们不知道有多少个空白字符，所以只能一个个匹配和去掉，需要递归。

先进行右边的递归去除空格
###### TrimRight
``` ts
type trimRight<Str extends string> = Str extends `${infer Rest}${' ' | '\n' | '\t'}` ? trimRight<Rest> : Str;
```

###### TrimLeft
``` ts
type trimLeft<Str extends string> = Str extends `${' ' | '\n' | '\t'}${infer Rest}` ? trimLeft<Rest> : Str;
```

左右两个 Trim 进行相关的合并后
``` ts
type Mytrim<T extends string> = trimRight<trimLeft<T>>
```

#### 函数

##### GetParameters
提取函数的参数类型
``` ts
type GetParameters<func extends Function> = func extends (...args: infer Args) => unknown ? Args : never;
```

##### GetReturnType
能提取参数类型，同样也可以提取返回值类型：
``` ts
type GetReturnType<func extends Function>  = func extends (...agrs: any[]) => infer value ? value : never;
```
参数类型可以是任意类型，也就是 any[]（*注意，这里不能用 unknown*，这里的解释涉及到参数的逆变性质)

##### GetThisParameterType
this 类型同样也可以通过模式匹配提取出来：
```typescript
type GetThisParameterType<T> 
    = T extends (this: infer ThisType, ...args: any[]) => any 
        ? ThisType 
        : unknown;
```

类型参数 T 是待处理的类型。

用 T 匹配一个模式类型，提取 this 的类型到 infer 声明的局部变量 ThisType 中，其余的参数是任意类型，也就是 any，返回值也是任意类型。

返回提取到的 ThisType。

#### 构造器

##### GetInstanceType
```typescript
type GetInstanceType<
    ConstructorType extends new (...args: any) => any
> = ConstructorType extends new (...args: any) => infer InstanceType 
        ? InstanceType 
        : any;
```
类型参数 ConstructorType 是待处理的类型，通过 extends 约束为构造器类型。

用 ConstructorType 匹配一个模式类型，提取返回的实例类型到 infer 声明的局部变量 InstanceType 里，返回 InstanceType。

##### GetConstructorParameters
GetInstanceType 是提取构造器返回值类型，那同样也可以提取构造器的参数类型：
```typescript
type GetConstructorParameters<
    ConstructorType extends new (...args: any) => any
> = ConstructorType extends new (...args: infer ParametersType) => any
    ? ParametersType
    : never;
```
类型参数 ConstructorType 为待处理的类型，通过 extends 约束为构造器类型。

用 ConstructorType 匹配一个模式类型，提取参数的部分到 infer 声明的局部变量 ParametersType 里，返回 ParametersType。

#### 索引类型
**索引类型也同样可以用模式匹配提取某个索引的值的类型**，比如 React 的 index.d.ts 里的 PropsWithRef 的高级类型，就是通过模式匹配提取了 ref 的值的类型：
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/33c5fa6ffe7a4fda85230e5b363e0d5c~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

##### 简化版的 GetRefProps
```typescript
type GetRefProps<Props> = 
    'ref' extends keyof Props
        ? Props extends { ref?: infer Value | undefined}
            ? Value
            : never
        : never;
```

- 通过 keyof Props 取出 Props 的所有索引构成的联合类型，判断下 ref 是否在其中，也就是 'ref' extends keyof Props。
- 因为ts3.0 里面如果没有对应的索引，Obj[Key] 返回的是 {} 而不是 never，所以这样做下兼容处理。所以需要进行相应的判断。

### 套路二：重新构造做变换
**TypeScript 的 type、infer、类型参数声明的变量都不能修改，想对类型做各种变换产生新的类型就需要重新构造。**
数组、字符串、函数等类型的重新构造比较简单。

索引类型，也就是多个元素的聚合类型的重新构造复杂一些，涉及到了映射类型的语法。

#### 数组类型

##### Push
数组添加在后面一个元素
```typescript
type Push<Arr extends  unknown[], Ele> = [...Arr, Ele];
```

##### Unshift
数组在前面添加一个元素
```typescript
type Unshift<Arr extends  unknown[], Ele> = [Ele, ...Arr];
```

##### Zip
合并两个数组（无限制个数的数组）
**设计思路：<u>递归复用做循环</u>**
``` ts
type Zip<Arr extends unknown[],Arr2 extends unknown[]> = Arr extends [infer First,...infer Rest] ? Arr2 extends [infer OtherFirst,...infer OtherRest] ? [[First: OtherFirst],...Zip<Rest,OtherRest>] : [] :[];
```
用 First、OtherFirst 构造成新的元组的一个元素，剩余元素继续递归处理 Rest、OtherRest。

#### 字符串类型

##### CapitalizeStr
把一个字符串字面量类型的变为首字母大写
**思路：用到字符串类型的提取和重新构造**
用到了 Uppercase 高级内置类型
``` ts
type CapitalizeStr<Str extends string> = Str extends `${infer First}${infer Rest}` ? `${Uppercase<First>}${Rest}` : Str;
```

##### CamelCase
下划线到驼峰形式的命名
**思路：模式匹配+递归循环**
``` ts
type CamelCase <Str extends string> = Str extends `${infer First}_${infer Other}${infer Rest}` ? `${First}${Uppercase<Other>}${CamelCase<Rest>}` : Str;
```

##### DropSubStr
删除字符串中的某个字段
``` ts
type DropSubStr<Str extends string, SubStr extends string> = Str extends `${infer Prefix}${SubStr}${infer Rest}` ? `${Prefix}${DropSubStr<Rest,SubStr>}` : Str;
```

#### 函数类型

##### AppendArgument
在已有的函数类型上添加一个参数
``` ts
type AppendArgument <Func extends Function,Arg> = Func extends (...args: infer arguments) => infer ReturnType ? (...args: [arguments,Arg]) => ReturnType : never;
```

#### 索引类型
索引类型是聚合多个元素的类型，class、对象等都是索引类型，比如这就是一个索引类型：
```typescript
type obj = {
  name: string;
  age: number;
  gender: boolean;
}
```

##### Mapping
映射过程中对 value 做下修改
``` ts
type Mapping <obj extends Object> = {
	[key in keyof obj]: [Obj[Key], Obj[Key], Obj[Key]]
}
```

##### UppercaseKey
除了可以对 Value 做修改，也可以对 Key 做修改，*使用 as*，这叫做`重映射`：
比如把索引类型的 Key 变为大写。
```typescript
type UppercaseKey<Obj extends object> = { 
    [Key in keyof Obj as Uppercase<Key & string>]: Obj[Key]
}
```
要做一些变换，也就是 as 之后的。

通过 Uppercase 把索引 Key 转为大写，因为索引可能为 string、number、symbol 类型，而这里只能接受 string 类型，所以要 & string，也就是取索引中 string 的部分。

##### Record
TypeScript 提供了**内置的高级类型 Record** 来创建索引类型：
``` ts
type Record<K extends string | number | symbol, T> = { [P in K]: T; }
```
上面的索引类型的约束我们用的 object，其实更语义化一点我推荐用 Record<string, any>：
```typescript
type UppercaseKey<Obj extends Record<string, any>> = { 
    [Key in keyof Obj as Uppercase<Key & string>]: Obj[Key]
}
```

##### ToReadonly
把索引类型里的 Key 加上 readonly 修饰
``` ts
type ToReadonly<obj extends Object> = {
	readonly [key in keyof obj]: obj[key];
}
```

##### ToPartial
把索引类型里的 Key 加上可选修饰
``` ts
type ToPartial<obj extends Object> = {
	[key in keyof obj]?: obj[key];
}
```

##### ToMutable
可以添加 readonly 修饰，当然也可以去掉：
```typescript
type ToMutable<T> = {
    -readonly [Key in keyof T]: T[Key]
}
```

##### ToRequired
同理，也可以去掉可选修饰符：
```typescript
type ToRequired<T> = {
    [Key in keyof T]-?: T[Key]
}
```

##### FilterByValueType
构造新索引类型的时候根据值的类型做下过滤
**思路:匹配+重构  as用来构建新的索引类型**
```typescript
type FilterByValueType<Obj extends Record<string,any>,FilterType> = {
    [Key in keyof T as Obj[Key] extends FilterType ? Key : never]: T[Key] 
}
```

### 套路三：递归复用
提取或构造的数组元素个数不确定、字符串长度不确定、对象层数不确定就用循环

**TypeScript 类型系统不支持循环，但支持递归。当处理数量（个数、长度、层数）不固定的类型的时候，可以只处理一个类型，然后递归的调用自身处理下一个类型，直到结束条件也就是所有的类型都处理完了，就完成了不确定数量的类型编程，达到循环的效果。**

#### 数组类型

##### ReverseArr
反转数组
``` ts
type ReverseArr<Arr extends unknown[]> = Arr extends [infer First,...infer Rest] ? [...ReverseArr<Rest>,First] : Arr;
```

##### Includes
在数组中查找固定的类型,返回 True 与 False 就行
``` ts
type Includes<Arr extends unknown[], FindItem> = Arr extends [infer First,...infer Rest] ? First extends FindItem ? true : Includes<Rest,FindItem> : false;
```
*不过这里有点问题,需要注意的是 A 判断 B 的子类型,B 也要去判断 A 的子类型*

``` ts
type IsEqual<A, B> = (A extends B ? true : false) & (B extends A ? true : false);
```

##### RemoveItem ***
删除一个数组里的值,改下返回结果，构造一个新的数组返回
``` ts
type RemoveItem<

    Arr extends unknown[],

    Item,

    Result extends unknown[] = []

> = Arr extends [infer First,...infer Rest]

    ? IsEqual<First,Item> extends true

        ? RemoveItem<Rest,Item,Result>

        : RemoveItem<Rest,Item,[...Result,First]>

    : Result;

type IsEqual<A, B> = (A extends B ? true : false) & (B extends A ? true : false);
```
思路挺不错的,一个个去判断,递归循环,如果当前的第一个为要移除的Item,侧不要当前的 First 元素

否者是把 First 元素它放入到 Result 结果当中

##### BuildArray
数组类型的构造，如果构造的数组类型元素个数不确定，也需要递归。
``` ts
type BuildArray< Length extends number, Ele = unknown, Arr extends unknown[] = [] > = Arr['length'] extends Length ? Arr : BuildArray<Length,Ele,[...Arr,Ele]>;
```

#### 字符类型

##### ReplaceAll
字符串里替换所有的指定的Item,从From变为To
``` ts
type ReplaceAll<Str extends string,From extends string,To extends string> = Str extends `${infer Prefix}${From}${infer Rest}` ?  ReplaceAll<`${Prefix}${To}${Rest}`,From,To> : Str;
```

##### StringToUnion
我们想把字符串字面量类型的每个字符都提取出来组成联合类型
``` ts
type StringToUnion<Str extends string> = Str extedns `${infer First}${infer Rest}` ? First | StringToUnion<Rest> : Str;
```

##### ReverseStr
字符串的反转
``` ts
type ReverseStr< Str extends string, Result extends string = '' > = Str extends `${infer First}${infer Rest}` ? ReverseStr<Rest,`${First}${Result}`> : Result;
```

#### 对象类型

##### DeepReadonly \*\****
索引类型层数，给索引加上了 readonly 的修饰
``` ts
type DeepReadonly<Obj extends Record<string, any>> = {
	readonly [Key in keyof Obj] : Obj[Key] extends Object ?  DeepReadonly<Obj[Key]> : Obj[Key];
}
```

### 套路四:数组长度做计数

**TypeScript 类型系统中没有加减乘除运算符，但是可以通过构造不同的数组然后取 length 的方式来完成数值计算，把数值的加减乘除转化为对数组的提取和构造。**

### 套路五：联合分散可简化

#### 前置知识
##### 分布式条件类型
>**当类型参数为联合类型，并且在条件类型左边直接引用该类型参数的时候，TypeScript 会把<u>每一个元素单独传入来做类型运算，最后再合并成联合类型</u>，这种语法叫做<u>分布式条件类型</u>。**

TypeScript 之所以这样处理联合类型也很容易理解，因为**联合类型的每个元素都是互不相关的，不像数组、索引、字符串那样元素之间是有关系的**。所以设计成了每一个单独处理，最后合并。

**举个🌰**
```typescript
type TestUnion<A, B = A> = A  extends A ? { a: A, b: B} : never;

type TestUnionResult = TestUnion<'a' | 'b' | 'c'>;
```

传入联合类型 'a' | 'b' | 'c' 的时候，结果是这样的：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/551f7861406c4ba591f6c50ffe17b153~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

##### 分布式条件类型条件下特殊的写法 ***
根据上面的🌰可以分为两种以下写法:

1. *A extends A* 这段看似没啥意义，主要是为了*触发分布式条件类型*，让 A 的每个类型单独传入。
2. /*[B] extends [A]* 这样不直接写 B 就可以*避免触发分布式条件类型*，那么 B 就是整个联合类型。
3. 如果是一个*变量为数组*,可以使用 *变量[number] 把该数组变为联合类型*

#### IsUnion
判断传入的参数是否为联合类型
``` ts
type IsUnion<A, B = A> = 
	A extends A 
		? [B] extends [A] 
			? false : true 
		: never
```
当传入联合类型时，会返回 true：
当传入其他类型时，会返回 false：

#### BEM
> bem 是 css 命名规范，用 block__element--modifier 的形式来描述某个区块下面的某个元素的某个状态的样式。

``` ts
type BEM< 
	Block extends string, 
	Element extends string[], 
	Modifiers extends string[] > = `${Block}__${Element[number]}--${Modifiers[number]}`;
```

#### AllCombinations \*\*\*\*(有难度)
全组合的高级类型，也是联合类型相关的
传入 'A' | 'B' 的时候，能够返回所有的组合： 'A' | 'B' | 'BA' | 'AB'

```typescript
type Combination<A extends string, B extends string> =
    | A
    | B
    | `${A}${B}`
    | `${B}${A}`;
```

然后构造出来的字符串再和其他字符串组合。

所以全组合的高级类型就是这样：

```typescript
type AllCombinations<A extends string, B extends string = A> = 
    A extends A
        ? Combination<A, AllCombinations<Exclude<B, A>>>
        : never;
```

类型参数 A、B 是待组合的两个联合类型，B 默认是 A 也就是同一个。

A extends A 的意义就是让联合类型每个类型单独传入做处理，上面我们刚学会。

A 的处理就是 A 和 B 中去掉 A 以后的所有类型组合，也就是 Combination<A, B 去掉 A 以后的所有组合>。

而 B 去掉 A 以后的所有组合就是 AllCombinations<Exclude<B, A>>，所以全组合就是 Combination<A, AllCombinations<Exclude<B, A>>>。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ba9469c0c3ea4ac0a5e1ebe96ac8bb1f~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

这里利用到了分布式条件类型的特性，通过 A extends A 来取出联合类型中的单个类型。

### 套路六：特殊特性要记清
