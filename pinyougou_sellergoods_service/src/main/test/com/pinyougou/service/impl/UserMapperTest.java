package com.pinyougou.service.impl;

import com.github.abel533.entity.Example;
import com.pinyougou.mapper.UserMapper;
import com.pinyougou.pojo.User;
import org.junit.Before;
import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import java.util.List;

public class UserMapperTest {

    private ApplicationContext context;
    @Before
    public void init(){
        context = new ClassPathXmlApplicationContext("classpath*:spring/applicationContext-*.xml");
    }

    @Test
    public void testselectByPrimaryKey(){
        UserMapper userMapper = context.getBean(UserMapper.class);
        User user = userMapper.selectByPrimaryKey(24);
        System.out.println(user);
    }
    @Test
    public void testinsertSelective(){
        UserMapper userMapper = context.getBean(UserMapper.class);
        User user = new User();
        user.setUsername("马超");
        user.setAddress("深圳黑马");
        user.setSex("1");
        userMapper.insertSelective(user);
        System.out.println(user);
    }
    @Test
    public void testselectByExample(){
        UserMapper userMapper = context.getBean(UserMapper.class);

        //构造查询条件
        Example example = new Example(User.class);
        Example.Criteria criteria = example.createCriteria();
        criteria.andLike("username", "%张%");

        //查询数据并输出
        List<User> users = userMapper.selectByExample(example);
        for (User user : users) {
            System.out.println(user);
        }
    }

}
