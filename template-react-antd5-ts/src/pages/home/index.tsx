import { Button } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { css } from 'twin.macro';

const Home = () => {

    const { data } = useQuery({
        queryKey: ['test'],
        queryFn: () => Promise.resolve(5)
    })

    return (
        <div>
            <h1 className="text-3xl font-bold underline">
                Hello world!
            </h1>
            <h2>useQuery response {data}</h2>
            <h3 css={css({ color: '#00FFFF' })}>emotion</h3>
            <Button type='primary'>primary</Button>
        </div>
    )
}

export default Home;