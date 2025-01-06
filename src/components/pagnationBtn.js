import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Pagination from 'react-bootstrap/Pagination';
import { useEffect } from 'react';

export default function PagnationBtn({page_num=1, data_length, change_page_num}) {
  const navigate = useNavigate();
  const [active, setActive] = useState(page_num)
  const [numOfPages, setNumOfPages] = useState(Math.ceil(data_length / 10))

  useEffect(() => {
    const getPageParam = () => {
      const queryParams = new URLSearchParams(window.location.search)
      return queryParams.get('page');
    }
    const current_page = getPageParam()
    if (current_page) {
      setActive(Number(current_page))
      change_page_num(Number(current_page))
    }
  }, [])
  

  const handleNextClick = (pg_num) => {
    setActive(pg_num)
    change_page_num(pg_num)
    const queryParams = new URLSearchParams(window.location.search);
    queryParams.set('page', `${pg_num}`);
    navigate({ search: queryParams.toString() }, { replace: true });
  };

  return (
    <Pagination>
      <Pagination.First disabled={true ? active === 1 : false} onClick={() => handleNextClick(1)}/>
      <Pagination.Prev disabled={true ? active < 2 : false} onClick={() => handleNextClick(active - 1 )}/>
      {active > 4 && numOfPages > 4 && <Pagination.Ellipsis />}
      
      {
        active < 4 ?
        <>
          {
            [1,2,3,4,5].map(num => {
              var btn_num = active + num
              if(num >= numOfPages){
                return null
              }
              return (
                <Pagination.Item onClick={() => handleNextClick(num)} active={true ? active === num : false}>{num}</Pagination.Item>
              )
            })
          }
        </>
        :
        <>
        {
          [-2,-1,0,1,2].map(num => {
            var btn_num = active + num
            if(btn_num >= numOfPages){
              return null
            }
            return (
              <Pagination.Item onClick={() => handleNextClick(btn_num)} active={true ? active === btn_num : false}>{btn_num}</Pagination.Item>
            )
          })
        }
        </>
      }

      {active < numOfPages - 4 && <Pagination.Ellipsis /> }
      <Pagination.Item onClick={() => handleNextClick(numOfPages)} active={true ? active === numOfPages : false}>{numOfPages}</Pagination.Item>
      <Pagination.Next onClick={() => handleNextClick(active + 1 )} disabled={true ? active >= numOfPages : false}/>
      <Pagination.Last onClick={() => handleNextClick(numOfPages)} disabled={true ? active >= numOfPages : false}/>
    </Pagination>
  );
}
