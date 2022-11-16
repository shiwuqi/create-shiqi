import { Button } from 'antd'
import { useQuery } from '@tanstack/react-query'
import styled from '@emotion/styled'

const Wrapper = styled('div')`
  h3 {
    color: hotpink;
  }
`

const Home = () => {

    const { data } = useQuery({
        queryKey: ['test'],
        queryFn: () => Promise.resolve(5)
    })

    return (
        <Wrapper>
            <h1 className="text-3xl font-bold underline">
                Hello world!
            </h1>
            <h2>useQuery response {data}</h2>
            <h3>emotion</h3>
            <Button type='primary'>primary</Button>
        </Wrapper>
    )
}

export default Home