console.log('主应用测试')

fetch(`/test/v1/topics`).then(res => {
    console.log('接口测试成功', res)
})

const App = () => {
    return <div>react测试</div>
}

ReactDOM.render(<App />, document.getElementById('root'))