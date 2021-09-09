/**
 * redux中间层 负责存储数据
 */
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import reducers from '../reducers/index';

export default createStore(reducers, applyMiddleware(thunk));
